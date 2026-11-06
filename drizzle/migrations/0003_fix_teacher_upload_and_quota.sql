ALTER TABLE public.classroom_assignments DROP CONSTRAINT IF EXISTS classroom_assignments_unit_check;
ALTER TABLE public.classroom_assignments ADD CONSTRAINT classroom_assignments_unit_check CHECK (unit >= 0 AND unit <= 12);

DROP POLICY IF EXISTS "signed in read class papers" ON storage.objects;
CREATE POLICY "signed in read class papers" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'class-papers' AND (
  public.has_role(auth.uid(), 'admin')
  OR ((storage.foldername(name))[2] = 'keys' AND public.is_class_teacher(((storage.foldername(name))[1])::uuid))
  OR ((storage.foldername(name))[2] IS DISTINCT FROM 'keys')
));
DROP POLICY IF EXISTS "teacher delete class papers" ON storage.objects;
CREATE POLICY "teacher delete class papers" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'class-papers' AND public.is_class_teacher(((storage.foldername(name))[1])::uuid));

CREATE OR REPLACE FUNCTION public.tutor_quota()
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); w public.tutor_wallets; used_today integer; lim integer;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('signed_in', false); END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
  SELECT * INTO w FROM public.tutor_wallets WHERE user_id = uid;
  SELECT coalesce(used, 0) INTO used_today FROM public.tutor_usage WHERE user_id = uid AND day = public.mm_today();
  used_today := coalesce(used_today, 0);
  lim := CASE WHEN public.has_role(uid, 'teacher') THEN 20 ELSE 10 END;
  RETURN json_build_object(
    'signed_in', true,
    'unlimited', (w.scholarship = 'approved' OR public.has_role(uid, 'admin')),
    'daily_limit', lim,
    'daily_left', greatest(0, lim - used_today),
    'bonus_left', w.bonus_left,
    'scholarship', w.scholarship);
END $function$;

CREATE OR REPLACE FUNCTION public.consume_tutor_message()
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); w public.tutor_wallets; used_today integer; p public.profiles; lim integer;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('ok', false, 'reason', 'signin'); END IF;
  SELECT * INTO p FROM public.profiles WHERE id = uid;
  IF p.status = 'suspended' AND (p.suspended_until IS NULL OR p.suspended_until > now()) THEN
    RETURN json_build_object('ok', false, 'reason', 'suspended');
  END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
  SELECT * INTO w FROM public.tutor_wallets WHERE user_id = uid FOR UPDATE;
  IF w.scholarship = 'approved' OR public.has_role(uid, 'admin') THEN
    RETURN json_build_object('ok', true);
  END IF;
  lim := CASE WHEN public.has_role(uid, 'teacher') THEN 20 ELSE 10 END;
  INSERT INTO public.tutor_usage (user_id, day, used) VALUES (uid, public.mm_today(), 0) ON CONFLICT DO NOTHING;
  SELECT used INTO used_today FROM public.tutor_usage WHERE user_id = uid AND day = public.mm_today() FOR UPDATE;
  IF used_today < lim THEN
    UPDATE public.tutor_usage SET used = used + 1 WHERE user_id = uid AND day = public.mm_today();
    RETURN json_build_object('ok', true);
  END IF;
  IF w.bonus_left > 0 THEN
    UPDATE public.tutor_wallets SET bonus_left = bonus_left - 1, updated_at = now() WHERE user_id = uid;
    RETURN json_build_object('ok', true);
  END IF;
  RETURN json_build_object('ok', false, 'reason', 'limit');
END $function$;