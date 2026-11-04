CREATE OR REPLACE FUNCTION public.is_main_admin(_user_id uuid)
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$ SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = _user_id AND lower(email) IN ('saikokayzin123@gmail.com','kayzinphyo1616@gmail.com')) $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  IF lower(NEW.email) IN ('saikokayzin123@gmail.com','kayzinphyo1616@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT id, email, raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url' FROM auth.users ON CONFLICT (id) DO NOTHING;
INSERT INTO public.user_roles (user_id, role) SELECT id, 'student' FROM auth.users ON CONFLICT DO NOTHING;
INSERT INTO public.user_roles (user_id, role) SELECT id, 'admin' FROM auth.users
  WHERE lower(email) IN ('saikokayzin123@gmail.com','kayzinphyo1616@gmail.com') ON CONFLICT DO NOTHING;
INSERT INTO public.tutor_wallets (user_id) SELECT id FROM auth.users ON CONFLICT DO NOTHING;