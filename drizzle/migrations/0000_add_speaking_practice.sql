CREATE TABLE IF NOT EXISTS public.speaking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  unit integer NOT NULL,
  turns integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 minutes'
);
CREATE INDEX IF NOT EXISTS speaking_sessions_user_idx ON public.speaking_sessions(user_id, unit, created_at);
GRANT SELECT ON public.speaking_sessions TO authenticated;
GRANT ALL ON public.speaking_sessions TO service_role;
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "own speaking sessions read" ON public.speaking_sessions;
CREATE POLICY "own speaking sessions read" ON public.speaking_sessions FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.speaking_unit_status(p_unit integer) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); n integer; unlimited boolean;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('used', 0, 'limit', 0, 'unlimited', false); END IF;
  unlimited := public.has_role(uid,'admin') OR public.has_role(uid,'teacher')
    OR EXISTS (SELECT 1 FROM public.tutor_wallets w WHERE w.user_id = uid AND w.scholarship = 'approved');
  SELECT count(*) INTO n FROM public.speaking_sessions
  WHERE user_id = uid AND unit = p_unit AND (created_at AT TIME ZONE 'Asia/Yangon')::date = public.mm_today();
  RETURN json_build_object('used', n, 'limit', 5, 'unlimited', unlimited);
END $$;

CREATE OR REPLACE FUNCTION public.start_speaking_session(p_unit integer) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); st json; sid uuid;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('ok', false, 'reason', 'signin'); END IF;
  st := public.speaking_unit_status(p_unit);
  IF NOT (st->>'unlimited')::boolean AND (st->>'used')::int >= (st->>'limit')::int THEN
    RETURN json_build_object('ok', false, 'reason', 'unit_limit');
  END IF;
  INSERT INTO public.speaking_sessions(user_id, unit) VALUES (uid, p_unit) RETURNING id INTO sid;
  RETURN json_build_object('ok', true, 'session', sid);
END $$;

CREATE OR REPLACE FUNCTION public.speaking_turn(p_session uuid) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.speaking_sessions;
BEGIN
  IF auth.uid() IS NULL THEN RETURN json_build_object('ok', false, 'reason', 'signin'); END IF;
  SELECT * INTO s FROM public.speaking_sessions WHERE id = p_session AND user_id = auth.uid() FOR UPDATE;
  IF s.id IS NULL THEN RETURN json_build_object('ok', false, 'reason', 'no_session'); END IF;
  IF s.expires_at < now() THEN RETURN json_build_object('ok', false, 'reason', 'expired'); END IF;
  IF s.turns >= 20 THEN RETURN json_build_object('ok', false, 'reason', 'limit'); END IF;
  UPDATE public.speaking_sessions SET turns = turns + 1 WHERE id = s.id;
  RETURN json_build_object('ok', true);
END $$;

REVOKE EXECUTE ON FUNCTION public.speaking_unit_status(integer), public.start_speaking_session(integer), public.speaking_turn(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.speaking_unit_status(integer), public.start_speaking_session(integer), public.speaking_turn(uuid) TO authenticated, service_role;