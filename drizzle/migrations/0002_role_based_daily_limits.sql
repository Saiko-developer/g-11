CREATE OR REPLACE FUNCTION public.tutor_quota() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE uid uuid := auth.uid(); w public.tutor_wallets; used int; lim int;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('signed_in', false); END IF;
  lim := CASE WHEN public.has_role(uid, 'teacher') THEN 10 ELSE 20 END;
  INSERT INTO public.tutor_wallets (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
  SELECT * INTO w FROM public.tutor_wallets WHERE user_id = uid;
  SELECT COALESCE((SELECT u.used FROM public.tutor_usage u WHERE u.user_id = uid AND u.day = public.mm_today()), 0) INTO used;
  RETURN jsonb_build_object('signed_in', true, 'daily_limit', lim, 'daily_left', greatest(lim - used, 0),
    'bonus_left', w.bonus_left, 'scholarship', w.scholarship,
    'unlimited', public.is_admin(uid) OR w.scholarship = 'approved');
END $$;

CREATE OR REPLACE FUNCTION public.exam_quota() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE uid uuid := auth.uid(); r text; lim int; used int; extra int;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('role', 'guest', 'limit', 0, 'used', 0, 'extra', 0); END IF;
  IF public.is_admin(uid) THEN r := 'admin'; lim := 1000;
  ELSIF public.has_role(uid, 'teacher') THEN r := 'teacher'; lim := 4;
  ELSE r := 'student'; lim := 2; END IF;
  SELECT count(*) INTO used FROM public.exam_generations
   WHERE user_id = uid AND (created_at AT TIME ZONE 'Asia/Yangon')::date = public.mm_today();
  SELECT COALESCE((SELECT exam_bonus_left FROM public.tutor_wallets WHERE user_id = uid), 0) INTO extra;
  RETURN jsonb_build_object('role', r, 'limit', lim, 'used', used, 'extra', extra);
END $$;