CREATE TABLE public.speaking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  unit int NOT NULL,
  day date NOT NULL DEFAULT public.mm_today(),
  started_at timestamptz NOT NULL DEFAULT now(),
  credits_used int NOT NULL DEFAULT 0
);
CREATE INDEX speaking_sessions_user_unit_day ON public.speaking_sessions (user_id, unit, day);
GRANT SELECT ON public.speaking_sessions TO authenticated;
GRANT ALL ON public.speaking_sessions TO service_role;
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own speaking sessions" ON public.speaking_sessions FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.speaking_unit_status(p_unit int)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object('used', count(*), 'limit', 2,
    'unlimited', COALESCE(public.is_admin(auth.uid()), false))
  FROM public.speaking_sessions WHERE user_id = auth.uid() AND unit = p_unit AND day = public.mm_today();
$$;

CREATE OR REPLACE FUNCTION public.start_speaking_session(p_unit int)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); n int; r jsonb; sid uuid;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'reason', 'signin'); END IF;
  IF p_unit IS NULL OR p_unit < 1 OR p_unit > 20 THEN RETURN jsonb_build_object('ok', false, 'reason', 'bad_unit'); END IF;
  IF NOT public.is_admin(uid) THEN
    SELECT count(*) INTO n FROM public.speaking_sessions WHERE user_id = uid AND unit = p_unit AND day = public.mm_today();
    IF n >= 2 THEN RETURN jsonb_build_object('ok', false, 'reason', 'unit_limit'); END IF;
  END IF;
  r := public.consume_tutor_message();
  IF NOT (r->>'ok')::boolean THEN RETURN r; END IF;
  INSERT INTO public.speaking_sessions (user_id, unit, credits_used) VALUES (uid, p_unit, 1) RETURNING id INTO sid;
  RETURN jsonb_build_object('ok', true, 'session', sid);
END $$;

-- Called on every AI turn: bills 1 credit per started 3-minute block.
CREATE OR REPLACE FUNCTION public.speaking_turn(p_session uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); s public.speaking_sessions; need int; r jsonb;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'reason', 'signin'); END IF;
  SELECT * INTO s FROM public.speaking_sessions WHERE id = p_session AND user_id = uid FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'reason', 'no_session'); END IF;
  IF now() - s.started_at > interval '60 minutes' THEN RETURN jsonb_build_object('ok', false, 'reason', 'expired'); END IF;
  need := floor(extract(epoch FROM now() - s.started_at) / 180)::int + 1;
  WHILE s.credits_used < need LOOP
    r := public.consume_tutor_message();
    IF NOT (r->>'ok')::boolean THEN RETURN r; END IF;
    s.credits_used := s.credits_used + 1;
    UPDATE public.speaking_sessions SET credits_used = s.credits_used WHERE id = s.id;
  END LOOP;
  RETURN jsonb_build_object('ok', true);
END $$;

REVOKE ALL ON FUNCTION public.start_speaking_session(int) FROM anon, public;
REVOKE ALL ON FUNCTION public.speaking_turn(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.start_speaking_session(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.speaking_turn(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.speaking_unit_status(int) TO authenticated;