CREATE TYPE public.app_role AS ENUM ('admin', 'student', 'teacher');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text, full_name text, avatar_url text,
  status text NOT NULL DEFAULT 'active',
  suspended_until timestamptz,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  name text NOT NULL, subject text NOT NULL DEFAULT '',
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.classroom_members (
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  display_name text NOT NULL DEFAULT '',
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (classroom_id, student_id)
);
CREATE TABLE public.classroom_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  title text NOT NULL, instructions text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'exam', unit integer NOT NULL DEFAULT 1,
  duration_minutes integer NOT NULL DEFAULT 60,
  due_at timestamptz, paper_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.class_exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.classroom_assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  image_paths text[] NOT NULL DEFAULT '{}',
  result jsonb, score numeric, total_marks numeric,
  teacher_feedback text NOT NULL DEFAULT '',
  graded_at timestamptz,
  UNIQUE (assignment_id, student_id)
);
CREATE TABLE public.class_exam_marking_guides (
  assignment_id uuid PRIMARY KEY REFERENCES public.classroom_assignments(id) ON DELETE CASCADE,
  files jsonb NOT NULL DEFAULT '[]'
);
CREATE TABLE public.class_exam_ai_drafts (
  attempt_id uuid PRIMARY KEY REFERENCES public.class_exam_attempts(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  result jsonb, error text, lease_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.class_exam_ai_control (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  paused boolean NOT NULL DEFAULT false,
  reason text, status_code integer
);
CREATE TABLE public.practice_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  unit integer NOT NULL, skill text NOT NULL, question_key text NOT NULL,
  answer text NOT NULL DEFAULT '', correct boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, unit, skill, question_key)
);
CREATE TABLE public.exam_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  unit integer NOT NULL DEFAULT 1, paper_title text,
  image_paths text[] NOT NULL DEFAULT '{}', page_count integer NOT NULL DEFAULT 0,
  result jsonb, score numeric, total_marks numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.exam_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, unit integer NOT NULL, paper jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.exam_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.grammar_generated_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit integer NOT NULL, section_id text NOT NULL, batch integer NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section_id, batch)
);
CREATE TABLE public.tutor_wallets (
  user_id uuid PRIMARY KEY,
  bonus_left integer NOT NULL DEFAULT 0,
  exam_bonus_left integer NOT NULL DEFAULT 0,
  scholarship text NOT NULL DEFAULT 'none',
  scholarship_note text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.tutor_usage (
  user_id uuid NOT NULL, day date NOT NULL, used integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
CREATE TABLE public.tutor_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, title text NOT NULL DEFAULT '',
  messages jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.payment_settings (
  id integer PRIMARY KEY,
  kpay text, wavepay text, account_name text, contact text,
  packages jsonb NOT NULL DEFAULT '[]',
  exam_packages jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.topup_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL DEFAULT 'tutor', method text NOT NULL,
  credits integer NOT NULL, price integer NOT NULL, txn_ref text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid, reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.teacher_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  school text NOT NULL DEFAULT '', subject text NOT NULL DEFAULT '', note text,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid, reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.profiles, public.classrooms, public.classroom_members, public.classroom_assignments,
  public.class_exam_attempts, public.class_exam_marking_guides, public.class_exam_ai_drafts,
  public.practice_attempts, public.exam_submissions, public.exam_generations,
  public.tutor_wallets, public.tutor_usage, public.tutor_chats, public.payment_settings,
  public.topup_requests, public.teacher_requests
TO authenticated;
GRANT SELECT ON public.user_roles, public.class_exam_ai_control TO authenticated;
GRANT SELECT ON public.grammar_generated_questions TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

CREATE OR REPLACE FUNCTION public.mm_today() RETURNS date
LANGUAGE sql STABLE SET search_path = public
AS $$ SELECT (now() AT TIME ZONE 'Asia/Yangon')::date $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_main_admin(_user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = _user_id
  AND lower(email) IN ('saikokayzin123@gmail.com', 'jaxsai939@gmail.com')) $$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(_user_id, 'admin') OR public.is_main_admin(_user_id) $$;

CREATE OR REPLACE FUNCTION public.is_class_teacher(_cid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.classrooms WHERE id = _cid AND teacher_id = auth.uid()) $$;

CREATE OR REPLACE FUNCTION public.is_class_member(_cid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = _cid AND student_id = auth.uid()) $$;

CREATE OR REPLACE FUNCTION public.strip_answers(j jsonb) RETURNS jsonb
LANGUAGE plpgsql IMMUTABLE SET search_path = public
AS $$
DECLARE r jsonb; k text; v jsonb;
BEGIN
  IF jsonb_typeof(j) = 'object' THEN
    r := '{}'::jsonb;
    FOR k, v IN SELECT * FROM jsonb_each(j) LOOP
      IF k NOT IN ('answer', 'answers', 'answerKey', 'answer_key', 'correct', 'correctAnswer', 'modelAnswer', 'markScheme', 'explanation') THEN
        r := r || jsonb_build_object(k, public.strip_answers(v));
      END IF;
    END LOOP;
    RETURN r;
  ELSIF jsonb_typeof(j) = 'array' THEN
    RETURN COALESCE((SELECT jsonb_agg(public.strip_answers(e)) FROM jsonb_array_elements(j) e), '[]'::jsonb);
  END IF;
  RETURN j;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
          NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  IF lower(NEW.email) IN ('saikokayzin123@gmail.com', 'jaxsai939@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.my_access() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE p public.profiles;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  SELECT * INTO p FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email) SELECT id, email FROM auth.users WHERE id = auth.uid()
    ON CONFLICT DO NOTHING RETURNING * INTO p;
  END IF;
  UPDATE public.profiles SET last_seen_at = now() WHERE id = auth.uid();
  IF p.status = 'suspended' AND p.suspended_until IS NOT NULL AND p.suspended_until < now() THEN
    UPDATE public.profiles SET status = 'active', suspended_until = NULL WHERE id = auth.uid();
    p.status := 'active'; p.suspended_until := NULL;
  END IF;
  RETURN jsonb_build_object('status', COALESCE(p.status, 'active'), 'suspended_until', p.suspended_until,
                            'is_admin', public.is_admin(auth.uid()));
END $$;

CREATE OR REPLACE FUNCTION public.my_name() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT COALESCE(full_name, '') FROM public.profiles WHERE id = auth.uid() $$;

CREATE OR REPLACE FUNCTION public.set_my_name(_name text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  UPDATE public.profiles SET full_name = left(trim(_name), 80) WHERE id = auth.uid();
  UPDATE public.classroom_members SET display_name = left(trim(_name), 80) WHERE student_id = auth.uid();
END $$;

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

CREATE OR REPLACE FUNCTION public.consume_tutor_message() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE uid uuid := auth.uid(); q jsonb;
BEGIN
  IF uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'reason', 'signin'); END IF;
  q := public.tutor_quota();
  IF (q->>'unlimited')::boolean THEN RETURN jsonb_build_object('ok', true); END IF;
  IF (q->>'daily_left')::int > 0 THEN
    INSERT INTO public.tutor_usage (user_id, day, used) VALUES (uid, public.mm_today(), 1)
    ON CONFLICT (user_id, day) DO UPDATE SET used = public.tutor_usage.used + 1;
    RETURN jsonb_build_object('ok', true);
  ELSIF (q->>'bonus_left')::int > 0 THEN
    UPDATE public.tutor_wallets SET bonus_left = bonus_left - 1, updated_at = now() WHERE user_id = uid;
    RETURN jsonb_build_object('ok', true);
  END IF;
  RETURN jsonb_build_object('ok', false, 'reason', 'limit');
END $$;

CREATE OR REPLACE FUNCTION public.request_scholarship(_note text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  INSERT INTO public.tutor_wallets (user_id, scholarship, scholarship_note) VALUES (auth.uid(), 'pending', _note)
  ON CONFLICT (user_id) DO UPDATE SET scholarship = 'pending', scholarship_note = _note, updated_at = now()
  WHERE public.tutor_wallets.scholarship <> 'approved';
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

CREATE OR REPLACE FUNCTION public.record_exam_generation(_unit integer, _paper jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE uid uuid := auth.uid(); q jsonb;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  q := public.exam_quota();
  IF (q->>'used')::int >= (q->>'limit')::int THEN
    IF (q->>'extra')::int <= 0 THEN RAISE EXCEPTION 'Daily exam limit reached'; END IF;
    UPDATE public.tutor_wallets SET exam_bonus_left = exam_bonus_left - 1, updated_at = now() WHERE user_id = uid;
  END IF;
  INSERT INTO public.exam_generations (user_id, unit, paper) VALUES (uid, _unit, _paper);
  RETURN public.exam_quota();
END $$;

CREATE OR REPLACE FUNCTION public.create_classroom(_name text, _subject text) RETURNS public.classrooms
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE c public.classrooms; _code text;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'teacher') OR public.is_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Only teachers can create classrooms';
  END IF;
  LOOP
    _code := upper(substr(md5(random()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classrooms cl WHERE cl.code = _code);
  END LOOP;
  INSERT INTO public.classrooms (teacher_id, name, subject, code)
  VALUES (auth.uid(), left(trim(_name), 120), left(trim(_subject), 120), _code) RETURNING * INTO c;
  RETURN c;
END $$;

CREATE OR REPLACE FUNCTION public.join_classroom_named(_code text, _name text) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT id INTO cid FROM public.classrooms WHERE code = upper(trim(_code));
  IF cid IS NULL THEN RAISE EXCEPTION 'Classroom code not found'; END IF;
  INSERT INTO public.classroom_members (classroom_id, student_id, display_name)
  VALUES (cid, auth.uid(), left(trim(_name), 80))
  ON CONFLICT (classroom_id, student_id) DO UPDATE SET display_name = EXCLUDED.display_name;
  RETURN cid;
END $$;

CREATE OR REPLACE FUNCTION public.join_classroom(_code text) RETURNS uuid
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$ SELECT public.join_classroom_named(_code, COALESCE(public.my_name(), '')) $$;

CREATE OR REPLACE FUNCTION public.my_classes()
RETURNS TABLE (id uuid, name text, subject text, code text, joined_at timestamptz, teacher_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.id, c.name, c.subject, c.code, m.joined_at, COALESCE(p.full_name, p.email, '')
  FROM public.classroom_members m JOIN public.classrooms c ON c.id = m.classroom_id
  LEFT JOIN public.profiles p ON p.id = c.teacher_id
  WHERE m.student_id = auth.uid() ORDER BY m.joined_at DESC
$$;

CREATE OR REPLACE FUNCTION public.classroom_roster_named(_cid uuid)
RETURNS TABLE (student_id uuid, display_name text, full_name text, email text, joined_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR public.is_admin(auth.uid())) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  RETURN QUERY SELECT m.student_id, m.display_name, p.full_name, p.email, m.joined_at
  FROM public.classroom_members m LEFT JOIN public.profiles p ON p.id = m.student_id
  WHERE m.classroom_id = _cid ORDER BY m.display_name;
END $$;

CREATE OR REPLACE FUNCTION public.classroom_roster(_cid uuid)
RETURNS TABLE (student_id uuid, full_name text, email text, avatar_url text, joined_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR public.is_admin(auth.uid())) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  RETURN QUERY SELECT m.student_id, p.full_name, p.email, p.avatar_url, m.joined_at
  FROM public.classroom_members m LEFT JOIN public.profiles p ON p.id = m.student_id
  WHERE m.classroom_id = _cid;
END $$;

CREATE OR REPLACE FUNCTION public.set_member_name(_cid uuid, _sid uuid, _name text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR public.is_admin(auth.uid())) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.classroom_members SET display_name = left(trim(_name), 80)
  WHERE classroom_id = _cid AND student_id = _sid;
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_open(_aid uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE a public.classroom_assignments; att public.class_exam_attempts; staff boolean; unlocked boolean;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT * INTO a FROM public.classroom_assignments WHERE id = _aid;
  IF NOT FOUND THEN RAISE EXCEPTION 'Exam not found'; END IF;
  staff := public.is_class_teacher(a.classroom_id) OR public.is_admin(auth.uid());
  IF NOT staff AND NOT public.is_class_member(a.classroom_id) THEN RAISE EXCEPTION 'You are not in this class'; END IF;
  IF NOT staff THEN
    INSERT INTO public.class_exam_attempts (assignment_id, student_id) VALUES (_aid, auth.uid())
    ON CONFLICT (assignment_id, student_id) DO NOTHING;
    SELECT * INTO att FROM public.class_exam_attempts WHERE assignment_id = _aid AND student_id = auth.uid();
  END IF;
  unlocked := staff OR att.submitted_at IS NOT NULL OR (a.due_at IS NOT NULL AND a.due_at < now());
  RETURN jsonb_build_object('id', a.id, 'title', a.title, 'instructions', a.instructions, 'due_at', a.due_at,
    'duration_minutes', a.duration_minutes, 'staff', staff, 'started_at', att.started_at,
    'submitted_at', att.submitted_at, 'key_unlocked', unlocked,
    'paper', CASE WHEN unlocked THEN a.paper_data ELSE public.strip_answers(a.paper_data) END);
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_submit(_aid uuid, _paths text[]) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM unnest(_paths) p WHERE p NOT LIKE auth.uid()::text || '/%' OR p LIKE '%..%') THEN
    RAISE EXCEPTION 'Invalid photo path';
  END IF;
  UPDATE public.class_exam_attempts SET image_paths = _paths, submitted_at = now()
  WHERE assignment_id = _aid AND student_id = auth.uid() AND submitted_at IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'Exam not open or already submitted'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_roster(_aid uuid)
RETURNS TABLE (student_id uuid, display_name text, attempt_id uuid, started_at timestamptz, submitted_at timestamptz,
  image_paths text[], result jsonb, score numeric, total_marks numeric, teacher_feedback text, graded_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE cid uuid;
BEGIN
  SELECT classroom_id INTO cid FROM public.classroom_assignments WHERE id = _aid;
  IF NOT (public.is_class_teacher(cid) OR public.is_admin(auth.uid())) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  RETURN QUERY SELECT m.student_id, m.display_name, t.id, t.started_at, t.submitted_at, t.image_paths,
    t.result, t.score, t.total_marks, t.teacher_feedback, t.graded_at
  FROM public.classroom_members m
  LEFT JOIN public.class_exam_attempts t ON t.assignment_id = _aid AND t.student_id = m.student_id
  WHERE m.classroom_id = cid ORDER BY m.display_name;
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_grade(_attempt uuid, _score numeric, _total numeric, _feedback text, _result jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE cid uuid;
BEGIN
  SELECT a.classroom_id INTO cid FROM public.class_exam_attempts t
  JOIN public.classroom_assignments a ON a.id = t.assignment_id WHERE t.id = _attempt;
  IF cid IS NULL OR NOT (public.is_class_teacher(cid) OR public.is_admin(auth.uid())) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.class_exam_attempts SET score = _score, total_marks = _total,
    teacher_feedback = COALESCE(_feedback, ''), result = _result, graded_at = now() WHERE id = _attempt;
END $$;

CREATE OR REPLACE FUNCTION public.claim_class_exam_ai(_attempt uuid, _force boolean DEFAULT false) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE d public.class_exam_ai_drafts;
BEGIN
  INSERT INTO public.class_exam_ai_drafts (attempt_id, status) VALUES (_attempt, 'pending') ON CONFLICT DO NOTHING;
  SELECT * INTO d FROM public.class_exam_ai_drafts WHERE attempt_id = _attempt FOR UPDATE;
  IF d.status = 'running' AND d.lease_until > now() THEN RETURN false; END IF;
  IF d.status = 'done' AND NOT _force THEN RETURN false; END IF;
  UPDATE public.class_exam_ai_drafts SET status = 'running', error = NULL,
    lease_until = now() + interval '5 minutes', updated_at = now() WHERE attempt_id = _attempt;
  RETURN true;
END $$;

CREATE OR REPLACE FUNCTION public.request_teacher_role(_school text, _subject text, _note text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF EXISTS (SELECT 1 FROM public.teacher_requests WHERE user_id = auth.uid() AND status = 'pending') THEN
    RAISE EXCEPTION 'You already have a pending request';
  END IF;
  INSERT INTO public.teacher_requests (user_id, school, subject, note) VALUES (auth.uid(), _school, _subject, _note);
END $$;

CREATE OR REPLACE FUNCTION public.admin_review_teacher(_id uuid, _approve boolean) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r public.teacher_requests;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Admins only'; END IF;
  UPDATE public.teacher_requests SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END,
    reviewed_by = auth.uid(), reviewed_at = now() WHERE id = _id AND status = 'pending' RETURNING * INTO r;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found or already reviewed'; END IF;
  IF _approve THEN INSERT INTO public.user_roles (user_id, role) VALUES (r.user_id, 'teacher') ON CONFLICT DO NOTHING; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.admin_review_topup(_id uuid, _approve boolean) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r public.topup_requests;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Admins only'; END IF;
  UPDATE public.topup_requests SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END,
    reviewed_by = auth.uid(), reviewed_at = now() WHERE id = _id AND status = 'pending' RETURNING * INTO r;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found or already reviewed'; END IF;
  IF _approve THEN
    INSERT INTO public.tutor_wallets (user_id) VALUES (r.user_id) ON CONFLICT DO NOTHING;
    IF r.kind = 'exam' THEN
      UPDATE public.tutor_wallets SET exam_bonus_left = exam_bonus_left + r.credits, updated_at = now() WHERE user_id = r.user_id;
    ELSE
      UPDATE public.tutor_wallets SET bonus_left = bonus_left + r.credits, updated_at = now() WHERE user_id = r.user_id;
    END IF;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.admin_exam_credit(_user uuid, _add integer) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Admins only'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (_user) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET exam_bonus_left = greatest(exam_bonus_left + _add, 0), updated_at = now() WHERE user_id = _user;
END $$;

CREATE OR REPLACE FUNCTION public.admin_tutor_update(_user uuid, _add_bonus integer, _scholarship text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Admins only'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (_user) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET bonus_left = greatest(bonus_left + COALESCE(_add_bonus, 0), 0),
    scholarship = COALESCE(_scholarship, scholarship), updated_at = now() WHERE user_id = _user;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_exam_marking_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_exam_ai_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_exam_ai_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_generated_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutor_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own or admin read profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "admin update profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "own or admin read roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "read classrooms" ON public.classrooms FOR SELECT TO authenticated
  USING (teacher_id = auth.uid() OR public.is_class_member(id) OR public.is_admin(auth.uid()));
CREATE POLICY "teacher update classroom" ON public.classrooms FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "teacher delete classroom" ON public.classrooms FOR DELETE TO authenticated
  USING (teacher_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "read members" ON public.classroom_members FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_class_teacher(classroom_id) OR public.is_admin(auth.uid()));
CREATE POLICY "leave or remove member" ON public.classroom_members FOR DELETE TO authenticated
  USING (student_id = auth.uid() OR public.is_class_teacher(classroom_id));

CREATE POLICY "read assignments" ON public.classroom_assignments FOR SELECT TO authenticated
  USING (public.is_class_teacher(classroom_id) OR public.is_admin(auth.uid()));
CREATE POLICY "teacher insert assignment" ON public.classroom_assignments FOR INSERT TO authenticated
  WITH CHECK (public.is_class_teacher(classroom_id) AND created_by = auth.uid());
CREATE POLICY "teacher update assignment" ON public.classroom_assignments FOR UPDATE TO authenticated
  USING (public.is_class_teacher(classroom_id)) WITH CHECK (public.is_class_teacher(classroom_id));
CREATE POLICY "teacher delete assignment" ON public.classroom_assignments FOR DELETE TO authenticated
  USING (public.is_class_teacher(classroom_id));

CREATE POLICY "members read assignments" ON public.classroom_assignments FOR SELECT TO authenticated
  USING (public.is_class_member(classroom_id));
REVOKE SELECT ON public.classroom_assignments FROM authenticated;
GRANT SELECT (id, classroom_id, created_by, title, instructions, kind, unit, duration_minutes, due_at, created_at)
  ON public.classroom_assignments TO authenticated;

CREATE POLICY "read attempts" ON public.class_exam_attempts FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND public.is_class_teacher(a.classroom_id)));

CREATE POLICY "teacher manage guides" ON public.class_exam_marking_guides FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND public.is_class_teacher(a.classroom_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND public.is_class_teacher(a.classroom_id)));

CREATE POLICY "teacher read drafts" ON public.class_exam_ai_drafts FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.class_exam_attempts t
    JOIN public.classroom_assignments a ON a.id = t.assignment_id
    WHERE t.id = attempt_id AND public.is_class_teacher(a.classroom_id)));

CREATE POLICY "read ai control" ON public.class_exam_ai_control FOR SELECT TO authenticated USING (true);

CREATE POLICY "own practice" ON public.practice_attempts FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "teacher read practice" ON public.practice_attempts FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.classroom_members m
    WHERE m.student_id = practice_attempts.user_id AND public.is_class_teacher(m.classroom_id)));

CREATE POLICY "own submissions" ON public.exam_submissions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "teacher read submissions" ON public.exam_submissions FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()) OR EXISTS (SELECT 1 FROM public.classroom_members m
    WHERE m.student_id = exam_submissions.user_id AND public.is_class_teacher(m.classroom_id)));

CREATE POLICY "own generations read" ON public.exam_generations FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "public read grammar questions" ON public.grammar_generated_questions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "own or admin wallet" ON public.tutor_wallets FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "own or admin usage" ON public.tutor_usage FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "own chats" ON public.tutor_chats FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "read checkout settings" ON public.payment_settings FOR SELECT TO authenticated
  USING (id = 1 OR public.is_admin(auth.uid()));
CREATE POLICY "admin insert settings" ON public.payment_settings FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admin update settings" ON public.payment_settings FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "read own or admin topups" ON public.topup_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "create own topup" ON public.topup_requests FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending' AND reviewed_by IS NULL);

CREATE POLICY "read own or admin teacher req" ON public.teacher_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "students upload own exam photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'exam-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "read own exam photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'exam-photos' AND ((storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM public.classroom_members m WHERE m.student_id::text = (storage.foldername(name))[1]
      AND public.is_class_teacher(m.classroom_id))));
CREATE POLICY "delete own exam photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'exam-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "teachers manage class papers" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'class-papers' AND public.is_class_teacher(((storage.foldername(name))[1])::uuid))
  WITH CHECK (bucket_id = 'class-papers' AND public.is_class_teacher(((storage.foldername(name))[1])::uuid));
CREATE POLICY "members read class question papers" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'class-papers' AND (storage.foldername(name))[2] IS DISTINCT FROM 'keys'
    AND public.is_class_member(((storage.foldername(name))[1])::uuid));

INSERT INTO public.payment_settings (id, packages, exam_packages) VALUES (1,
  '[{"credits":50,"price":1000},{"credits":150,"price":2500}]',
  '[{"credits":5,"price":1500},{"credits":15,"price":4000}]') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.class_exam_ai_control (id) VALUES (true) ON CONFLICT DO NOTHING;

ALTER TABLE public.classroom_assignments ALTER COLUMN created_by SET DEFAULT auth.uid();
ALTER TABLE public.exam_submissions ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.tutor_chats ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.practice_attempts ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.topup_requests ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.teacher_requests ALTER COLUMN user_id SET DEFAULT auth.uid();

CREATE TABLE public.class_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid(),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX class_posts_room_idx ON public.class_posts (classroom_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.class_posts TO authenticated;
GRANT ALL ON public.class_posts TO service_role;
ALTER TABLE public.class_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read class posts" ON public.class_posts FOR SELECT TO authenticated
  USING (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id) OR public.is_admin(auth.uid()));
CREATE POLICY "write class posts" ON public.class_posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id)));
CREATE POLICY "delete class posts" ON public.class_posts FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_class_teacher(classroom_id) OR public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.class_feed(_cid uuid)
RETURNS TABLE (id uuid, author_id uuid, author_name text, is_teacher boolean, body text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR public.is_class_member(_cid) OR public.is_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  RETURN QUERY
  SELECT p.id, p.author_id,
    COALESCE(NULLIF(m.display_name, ''), pr.full_name, 'User'),
    (p.author_id = c.teacher_id), p.body, p.created_at
  FROM public.class_posts p
  JOIN public.classrooms c ON c.id = p.classroom_id
  LEFT JOIN public.classroom_members m ON m.classroom_id = p.classroom_id AND m.student_id = p.author_id
  LEFT JOIN public.profiles pr ON pr.id = p.author_id
  WHERE p.classroom_id = _cid
  ORDER BY p.created_at DESC
  LIMIT 200;
END $$;
GRANT EXECUTE ON FUNCTION public.class_feed(uuid) TO authenticated;

CREATE TABLE public.class_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  peer_id uuid,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX class_messages_thread_idx ON public.class_messages (classroom_id, peer_id, created_at);
GRANT SELECT, DELETE ON public.class_messages TO authenticated;
GRANT ALL ON public.class_messages TO service_role;
ALTER TABLE public.class_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read class messages" ON public.class_messages FOR SELECT TO authenticated
USING (
  (peer_id IS NULL AND (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id)))
  OR (peer_id IS NOT NULL AND (peer_id = auth.uid() OR public.is_class_teacher(classroom_id)))
);
CREATE POLICY "delete class messages" ON public.class_messages FOR DELETE TO authenticated
USING (sender_id = auth.uid() OR (peer_id IS NULL AND public.is_class_teacher(classroom_id)));

CREATE TABLE public.class_chat_reads (
  user_id uuid NOT NULL,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  thread text NOT NULL,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, classroom_id, thread)
);
GRANT SELECT ON public.class_chat_reads TO authenticated;
GRANT ALL ON public.class_chat_reads TO service_role;
ALTER TABLE public.class_chat_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reads" ON public.class_chat_reads FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.class_chat_send(_cid uuid, _peer uuid, _body text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _id uuid; _t text := btrim(coalesce(_body,''));
BEGIN
  IF _t = '' OR char_length(_t) > 4000 THEN RAISE EXCEPTION 'Message must be 1-4000 characters'; END IF;
  IF _peer IS NULL THEN
    IF NOT (is_class_teacher(_cid) OR is_class_member(_cid)) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM classroom_members WHERE classroom_id=_cid AND student_id=_peer) THEN RAISE EXCEPTION 'Student not in class'; END IF;
    IF NOT (is_class_teacher(_cid) OR _peer = auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  END IF;
  INSERT INTO class_messages(classroom_id, sender_id, peer_id, body) VALUES (_cid, auth.uid(), _peer, _t) RETURNING id INTO _id;
  INSERT INTO class_chat_reads(user_id, classroom_id, thread, last_read_at)
  VALUES (auth.uid(), _cid, coalesce(_peer::text,'group'), now())
  ON CONFLICT (user_id, classroom_id, thread) DO UPDATE SET last_read_at = now();
  RETURN _id;
END $$;

CREATE OR REPLACE FUNCTION public.class_chat(_cid uuid, _peer uuid)
RETURNS TABLE(id uuid, sender_id uuid, sender_name text, is_teacher boolean, body text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _peer IS NULL THEN
    IF NOT (is_class_teacher(_cid) OR is_class_member(_cid) OR is_admin(auth.uid())) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  ELSE
    IF NOT (is_class_teacher(_cid) OR _peer = auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  END IF;
  RETURN QUERY
  SELECT m.id, m.sender_id,
    coalesce(nullif(cm.display_name,''), p.full_name, 'User'),
    (m.sender_id = c.teacher_id), m.body, m.created_at
  FROM class_messages m
  JOIN classrooms c ON c.id = m.classroom_id
  LEFT JOIN classroom_members cm ON cm.classroom_id = m.classroom_id AND cm.student_id = m.sender_id
  LEFT JOIN profiles p ON p.id = m.sender_id
  WHERE m.classroom_id = _cid AND m.peer_id IS NOT DISTINCT FROM _peer
  ORDER BY m.created_at ASC
  LIMIT 1000;
END $$;

CREATE OR REPLACE FUNCTION public.class_chat_mark_read(_cid uuid, _thread text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO class_chat_reads(user_id, classroom_id, thread, last_read_at)
  VALUES (auth.uid(), _cid, _thread, now())
  ON CONFLICT (user_id, classroom_id, thread) DO UPDATE SET last_read_at = now();
$$;

CREATE OR REPLACE FUNCTION public.class_chat_unread(_cid uuid)
RETURNS TABLE(thread text, unread integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(m.peer_id::text,'group') AS thread, count(*)::int
  FROM class_messages m
  LEFT JOIN class_chat_reads r ON r.user_id = auth.uid() AND r.classroom_id = m.classroom_id
       AND r.thread = coalesce(m.peer_id::text,'group')
  WHERE m.classroom_id = _cid AND m.sender_id <> auth.uid()
    AND (r.last_read_at IS NULL OR m.created_at > r.last_read_at)
    AND (
      (m.peer_id IS NULL AND (is_class_teacher(_cid) OR is_class_member(_cid)))
      OR (m.peer_id IS NOT NULL AND (m.peer_id = auth.uid() OR is_class_teacher(_cid)))
    )
  GROUP BY 1;
$$;

GRANT EXECUTE ON FUNCTION public.class_chat_send(uuid,uuid,text), public.class_chat(uuid,uuid), public.class_chat_mark_read(uuid,text), public.class_chat_unread(uuid) TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.class_messages;