create type public.app_role as enum ('admin','student','teacher');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, full_name text, avatar_url text,
  status text not null default 'active',
  suspended_until timestamptz,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.is_main_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from auth.users where id = _user_id
    and lower(email) in ('saikokayzin123@gmail.com', 'jaxsai939@gmail.com'))
$$;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
      or (_role = 'admin' and public.is_main_admin(_user_id))
$$;

create policy "own profile read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "admin profile update" on public.profiles for update to authenticated
  using (public.has_role(auth.uid(),'admin'));
create policy "own roles read" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'student') on conflict do nothing;
  if lower(new.email) in ('saikokayzin123@gmail.com', 'jaxsai939@gmail.com') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
revoke all on function public.handle_new_user() from anon, authenticated;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.my_access()
returns json language plpgsql security definer set search_path = public as $$
declare p public.profiles;
begin
  if auth.uid() is null then return null; end if;
  select * into p from public.profiles where id = auth.uid();
  if not found then
    insert into public.profiles (id, email) select id, email from auth.users where id = auth.uid()
      on conflict do nothing returning * into p;
  end if;
  if p.status = 'suspended' and p.suspended_until is not null and p.suspended_until < now() then
    update public.profiles set status = 'active', suspended_until = null where id = p.id returning * into p;
  end if;
  update public.profiles set last_seen_at = now() where id = p.id;
  return json_build_object('status', coalesce(p.status,'active'), 'suspended_until', p.suspended_until,
    'is_admin', public.has_role(auth.uid(),'admin'));
end $$;
grant execute on function public.my_access() to authenticated;

create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  unit int not null, skill text not null, question_key text not null,
  answer text not null default '',
  correct boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, unit, skill, question_key)
);
grant select, insert, update on public.practice_attempts to authenticated;
grant all on public.practice_attempts to service_role;
alter table public.practice_attempts enable row level security;
create policy "own or admin read attempts" on public.practice_attempts for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own insert attempts" on public.practice_attempts for insert to authenticated with check (user_id = auth.uid());
create policy "own update attempts" on public.practice_attempts for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.exam_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  unit int not null, paper_title text, score numeric, total_marks numeric, result jsonb,
  page_count int not null default 0,
  image_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.exam_submissions to authenticated;
grant all on public.exam_submissions to service_role;
alter table public.exam_submissions enable row level security;
create policy "own or admin read exams" on public.exam_submissions for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own insert exams" on public.exam_submissions for insert to authenticated with check (user_id = auth.uid());
create policy "own or admin delete exams" on public.exam_submissions for delete to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "own upload exam photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'exam-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own or admin read exam photos" on storage.objects for select to authenticated
  using (bucket_id = 'exam-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(),'admin')));
create policy "own or admin delete exam photos" on storage.objects for delete to authenticated
  using (bucket_id = 'exam-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.has_role(auth.uid(), 'admin')));

CREATE TABLE public.tutor_wallets (
  user_id uuid PRIMARY KEY,
  bonus_left integer NOT NULL DEFAULT 20,
  scholarship text NOT NULL DEFAULT 'none',
  scholarship_note text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tutor_wallets TO authenticated;
GRANT ALL ON public.tutor_wallets TO service_role;
ALTER TABLE public.tutor_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read wallet" ON public.tutor_wallets FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.tutor_usage (
  user_id uuid NOT NULL, day date NOT NULL, used integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
GRANT SELECT ON public.tutor_usage TO authenticated;
GRANT ALL ON public.tutor_usage TO service_role;
ALTER TABLE public.tutor_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read usage" ON public.tutor_usage FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.payment_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  kpay text, wavepay text, account_name text, contact text,
  packages jsonb NOT NULL DEFAULT '[{"credits":50,"price":1000},{"credits":150,"price":2500}]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.payment_settings TO authenticated;
GRANT ALL ON public.payment_settings TO service_role;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "signed in read payment settings" ON public.payment_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin update payment settings" ON public.payment_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.payment_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE public.topup_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  credits integer NOT NULL CHECK (credits > 0),
  price integer NOT NULL CHECK (price >= 0),
  method text NOT NULL DEFAULT 'kpay',
  txn_ref text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz, reviewed_by uuid
);
GRANT SELECT, INSERT ON public.topup_requests TO authenticated;
GRANT ALL ON public.topup_requests TO service_role;
ALTER TABLE public.topup_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own insert pending topup" ON public.topup_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending' AND reviewed_at IS NULL AND reviewed_by IS NULL
    AND length(txn_ref) BETWEEN 3 AND 64 AND method IN ('kpay','wavepay','other'));
CREATE POLICY "own or admin read topups" ON public.topup_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.exam_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  unit integer NOT NULL, paper jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX exam_generations_user_created_idx ON public.exam_generations (user_id, created_at DESC);
GRANT SELECT ON public.exam_generations TO authenticated;
GRANT ALL ON public.exam_generations TO service_role;
ALTER TABLE public.exam_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read exam generations" ON public.exam_generations FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.mm_today() RETURNS date
LANGUAGE sql STABLE SET search_path = public AS $$ SELECT (now() AT TIME ZONE 'Asia/Yangon')::date $$;

CREATE OR REPLACE FUNCTION public.tutor_quota() RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); w public.tutor_wallets; used_today integer;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('signed_in', false); END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
  SELECT * INTO w FROM public.tutor_wallets WHERE user_id = uid;
  SELECT coalesce(used, 0) INTO used_today FROM public.tutor_usage WHERE user_id = uid AND day = public.mm_today();
  used_today := coalesce(used_today, 0);
  RETURN json_build_object(
    'signed_in', true,
    'unlimited', (w.scholarship = 'approved' OR public.has_role(uid, 'admin') OR public.has_role(uid, 'teacher')),
    'daily_limit', 10,
    'daily_left', greatest(0, 10 - used_today),
    'bonus_left', w.bonus_left,
    'scholarship', w.scholarship);
END $$;

CREATE OR REPLACE FUNCTION public.consume_tutor_message() RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); w public.tutor_wallets; used_today integer; p public.profiles;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('ok', false, 'reason', 'signin'); END IF;
  SELECT * INTO p FROM public.profiles WHERE id = uid;
  IF p.status = 'suspended' AND (p.suspended_until IS NULL OR p.suspended_until > now()) THEN
    RETURN json_build_object('ok', false, 'reason', 'suspended');
  END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
  SELECT * INTO w FROM public.tutor_wallets WHERE user_id = uid FOR UPDATE;
  IF w.scholarship = 'approved' OR public.has_role(uid, 'admin') OR public.has_role(uid, 'teacher') THEN
    RETURN json_build_object('ok', true);
  END IF;
  INSERT INTO public.tutor_usage (user_id, day, used) VALUES (uid, public.mm_today(), 0) ON CONFLICT DO NOTHING;
  SELECT used INTO used_today FROM public.tutor_usage WHERE user_id = uid AND day = public.mm_today() FOR UPDATE;
  IF used_today < 10 THEN
    UPDATE public.tutor_usage SET used = used + 1 WHERE user_id = uid AND day = public.mm_today();
    RETURN json_build_object('ok', true);
  END IF;
  IF w.bonus_left > 0 THEN
    UPDATE public.tutor_wallets SET bonus_left = bonus_left - 1, updated_at = now() WHERE user_id = uid;
    RETURN json_build_object('ok', true);
  END IF;
  RETURN json_build_object('ok', false, 'reason', 'limit');
END $$;

CREATE OR REPLACE FUNCTION public.request_scholarship(_note text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Please sign in'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (auth.uid()) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET scholarship = 'pending', scholarship_note = left(coalesce(_note, ''), 500), updated_at = now()
  WHERE user_id = auth.uid() AND scholarship <> 'approved';
END $$;

CREATE OR REPLACE FUNCTION public.admin_tutor_update(_user uuid, _add_bonus integer, _scholarship text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (_user) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET
    bonus_left = greatest(0, bonus_left + coalesce(_add_bonus, 0)),
    scholarship = CASE WHEN _scholarship IN ('none','approved','rejected') THEN _scholarship ELSE scholarship END,
    updated_at = now()
  WHERE user_id = _user;
END $$;

CREATE OR REPLACE FUNCTION public.admin_review_topup(_id uuid, _approve boolean) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.topup_requests;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT * INTO r FROM public.topup_requests WHERE id = _id FOR UPDATE;
  IF r.id IS NULL OR r.status <> 'pending' THEN RAISE EXCEPTION 'Request already reviewed'; END IF;
  UPDATE public.topup_requests SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END,
    reviewed_at = now(), reviewed_by = auth.uid() WHERE id = _id;
  IF _approve THEN
    INSERT INTO public.tutor_wallets (user_id) VALUES (r.user_id) ON CONFLICT DO NOTHING;
    UPDATE public.tutor_wallets SET bonus_left = bonus_left + r.credits, updated_at = now() WHERE user_id = r.user_id;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.exam_quota() RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); n integer; role_name text; lim integer;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('role', 'guest', 'limit', 0, 'used', 0); END IF;
  IF public.has_role(uid, 'admin') THEN role_name := 'admin'; lim := -1;
  ELSIF public.has_role(uid, 'teacher') THEN role_name := 'teacher'; lim := 10;
  ELSE role_name := 'student'; lim := 3; END IF;
  SELECT count(*) INTO n FROM public.exam_generations
  WHERE user_id = uid AND (created_at AT TIME ZONE 'Asia/Yangon')::date = public.mm_today();
  RETURN json_build_object('role', role_name, 'limit', lim, 'used', n);
END $$;

CREATE OR REPLACE FUNCTION public.record_exam_generation(_unit integer, _paper jsonb) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE q json;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Please sign in'; END IF;
  q := public.exam_quota();
  IF (q->>'limit')::int >= 0 AND (q->>'used')::int >= (q->>'limit')::int THEN RAISE EXCEPTION 'Daily limit reached'; END IF;
  INSERT INTO public.exam_generations (user_id, unit, paper) VALUES (auth.uid(), _unit, _paper);
  RETURN public.exam_quota();
END $$;

REVOKE EXECUTE ON FUNCTION public.tutor_quota(), public.consume_tutor_message(), public.request_scholarship(text),
  public.admin_tutor_update(uuid, integer, text), public.admin_review_topup(uuid, boolean),
  public.exam_quota(), public.record_exam_generation(integer, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.tutor_quota(), public.consume_tutor_message(), public.request_scholarship(text),
  public.admin_tutor_update(uuid, integer, text), public.admin_review_topup(uuid, boolean),
  public.exam_quota(), public.record_exam_generation(integer, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mm_today() TO authenticated, anon;