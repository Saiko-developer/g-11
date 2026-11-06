ALTER TABLE public.tutor_wallets ALTER COLUMN bonus_left SET DEFAULT 5;
ALTER TABLE public.tutor_wallets ALTER COLUMN exam_bonus_left SET DEFAULT 2;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'student') ON CONFLICT DO NOTHING;
  IF lower(new.email) IN ('saikokayzin123@gmail.com', 'jaxsai939@gmail.com', 'kayzinphyo1616@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  INSERT INTO public.tutor_wallets (user_id, bonus_left, exam_bonus_left) VALUES (new.id, 5, 2) ON CONFLICT DO NOTHING;
  RETURN new;
END $$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;

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
  lim := CASE WHEN public.has_role(uid, 'teacher') THEN 10 ELSE 20 END;
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
  lim := CASE WHEN public.has_role(uid, 'teacher') THEN 10 ELSE 20 END;
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

CREATE OR REPLACE FUNCTION public.exam_quota() RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); n integer; role_name text; lim integer; extra integer;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('role', 'guest', 'limit', 0, 'used', 0, 'extra', 0); END IF;
  IF public.has_role(uid, 'admin') THEN role_name := 'admin'; lim := -1;
  ELSIF public.has_role(uid, 'teacher') THEN role_name := 'teacher'; lim := 4;
  ELSE role_name := 'student'; lim := 2; END IF;
  SELECT count(*) INTO n FROM public.exam_generations
  WHERE user_id = uid AND (created_at AT TIME ZONE 'Asia/Yangon')::date = public.mm_today();
  SELECT coalesce(w.exam_bonus_left, 0) INTO extra FROM public.tutor_wallets w WHERE w.user_id = uid;
  RETURN json_build_object('role', role_name, 'limit', lim, 'used', n, 'extra', coalesce(extra, 0));
END $$;