
CREATE TYPE public.app_role AS ENUM ('admin','student','teacher');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text, full_name text, avatar_url text,
  status text NOT NULL DEFAULT 'active', suspended_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL, UNIQUE (user_id, role)
);
CREATE TABLE public.tutor_wallets (
  user_id uuid PRIMARY KEY, bonus_left int NOT NULL DEFAULT 5, exam_bonus_left int NOT NULL DEFAULT 0,
  scholarship text NOT NULL DEFAULT 'none', scholarship_note text, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.tutor_usage (user_id uuid NOT NULL, day date NOT NULL, used int NOT NULL DEFAULT 0, PRIMARY KEY (user_id, day));
CREATE TABLE public.tutor_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid(),
  title text NOT NULL DEFAULT 'New chat', messages jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.payment_settings (
  id int PRIMARY KEY, kpay text, wavepay text, account_name text, contact text,
  packages jsonb NOT NULL DEFAULT '[]', exam_packages jsonb NOT NULL DEFAULT '[]', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.topup_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid(),
  kind text NOT NULL DEFAULT 'tutor', credits int NOT NULL, price int NOT NULL, method text NOT NULL, txn_ref text NOT NULL,
  status text NOT NULL DEFAULT 'pending', reviewed_at timestamptz, reviewed_by uuid, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.teacher_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, school text NOT NULL, subject text NOT NULL, note text,
  status text NOT NULL DEFAULT 'pending', reviewed_at timestamptz, reviewed_by uuid, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.exam_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, unit int NOT NULL, paper jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.exam_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid(), unit int NOT NULL,
  image_paths text[] NOT NULL DEFAULT '{}', page_count int NOT NULL DEFAULT 0, paper_title text, result jsonb,
  score numeric, total_marks numeric, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.exam_uploads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.practice_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid(), unit int NOT NULL, skill text NOT NULL,
  question_key text NOT NULL, answer text NOT NULL DEFAULT '', correct boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (user_id, question_key)
);
CREATE TABLE public.grammar_generated_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), unit int NOT NULL, section_id text NOT NULL, batch int NOT NULL DEFAULT 0,
  questions jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, from_admin boolean NOT NULL DEFAULT false, body text NOT NULL,
  read_by_user boolean NOT NULL DEFAULT false, read_by_admin boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, body text NOT NULL DEFAULT '', active boolean NOT NULL DEFAULT true,
  created_by uuid, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), teacher_id uuid NOT NULL, name text NOT NULL, subject text NOT NULL DEFAULT 'English',
  code text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.classroom_members (
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE, student_id uuid NOT NULL,
  display_name text NOT NULL DEFAULT '', joined_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (classroom_id, student_id)
);
CREATE TABLE public.classroom_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  created_by uuid NOT NULL DEFAULT auth.uid(), kind text NOT NULL, title text NOT NULL, instructions text NOT NULL DEFAULT '',
  unit int NOT NULL DEFAULT 0, due_at timestamptz, duration_minutes int NOT NULL DEFAULT 60, paper_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.class_exam_marking_guides (
  assignment_id uuid PRIMARY KEY REFERENCES public.classroom_assignments(id) ON DELETE CASCADE, files jsonb NOT NULL DEFAULT '[]'
);
CREATE TABLE public.class_exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), assignment_id uuid NOT NULL REFERENCES public.classroom_assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL, started_at timestamptz NOT NULL DEFAULT now(), submitted_at timestamptz, graded_at timestamptz,
  image_paths text[] NOT NULL DEFAULT '{}', result jsonb, score numeric, total_marks numeric, teacher_feedback text NOT NULL DEFAULT '',
  UNIQUE (assignment_id, student_id)
);
CREATE TABLE public.class_exam_ai_drafts (
  attempt_id uuid PRIMARY KEY REFERENCES public.class_exam_attempts(id) ON DELETE CASCADE, status text NOT NULL DEFAULT 'pending',
  result jsonb, error text, lease_until timestamptz, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.class_exam_ai_control (id boolean PRIMARY KEY DEFAULT true, paused boolean NOT NULL DEFAULT false, reason text, status_code int);
CREATE TABLE public.class_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid(), body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.class_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL, peer_id uuid, body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.class_chat_reads (
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE, user_id uuid NOT NULL, thread text NOT NULL,
  last_read_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (classroom_id, user_id, thread)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON public.announcements, public.grammar_generated_questions TO anon;

CREATE OR REPLACE FUNCTION public.mm_today() RETURNS date LANGUAGE sql STABLE SET search_path = public
AS $$ SELECT (now() AT TIME ZONE 'Asia/Yangon')::date $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_main_admin(_user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = _user_id AND lower(email) IN ('saikokayzin123@gmail.com')) $$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(_user_id, 'admin') OR public.is_main_admin(_user_id) $$;

CREATE OR REPLACE FUNCTION public.is_class_teacher(_cid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.classrooms WHERE id = _cid AND teacher_id = auth.uid()) OR public.is_admin(auth.uid()) $$;

CREATE OR REPLACE FUNCTION public.is_class_member(_cid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = _cid AND student_id = auth.uid()) $$;

CREATE OR REPLACE FUNCTION public.teaches_student(_sid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.classroom_members m JOIN public.classrooms c ON c.id = m.classroom_id
  WHERE m.student_id = _sid AND c.teacher_id = auth.uid()) $$;

CREATE OR REPLACE FUNCTION public.strip_answers(j jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE SET search_path = public
AS $$
DECLARE k text; v jsonb; out jsonb;
BEGIN
  IF j IS NULL THEN RETURN NULL; END IF;
  IF jsonb_typeof(j) = 'object' THEN
    out := '{}'::jsonb;
    FOR k, v IN SELECT * FROM jsonb_each(j) LOOP
      IF k NOT IN ('answer','answers','correct','correctAnswer','correct_answer','answerKey','answer_key','explanation','modelAnswer','model_answer','sampleAnswer','sample_answer','markingGuide','marking_guide','rubric') THEN
        out := out || jsonb_build_object(k, public.strip_answers(v));
      END IF;
    END LOOP;
    RETURN out;
  ELSIF jsonb_typeof(j) = 'array' THEN
    SELECT coalesce(jsonb_agg(public.strip_answers(e)), '[]'::jsonb) INTO out FROM jsonb_array_elements(j) e;
    RETURN out;
  END IF;
  RETURN j;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  IF lower(NEW.email) = 'saikokayzin123@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.my_access() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE p public.profiles;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  UPDATE public.profiles SET last_seen_at = now() WHERE id = auth.uid() RETURNING * INTO p;
  RETURN jsonb_build_object('status', coalesce(p.status,'active'), 'suspended_until', p.suspended_until, 'is_admin', public.is_admin(auth.uid()));
END $$;

CREATE OR REPLACE FUNCTION public.my_name() RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT full_name FROM public.profiles WHERE id = auth.uid() $$;

CREATE OR REPLACE FUNCTION public.set_my_name(_name text) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$ UPDATE public.profiles SET full_name = left(trim(_name), 80) WHERE id = auth.uid() $$;

CREATE OR REPLACE FUNCTION public.tutor_quota() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE u uuid := auth.uid(); w public.tutor_wallets; used int; lim int;
BEGIN
  IF u IS NULL THEN RETURN jsonb_build_object('signed_in', false); END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (u) ON CONFLICT DO NOTHING;
  SELECT * INTO w FROM public.tutor_wallets WHERE user_id = u;
  SELECT coalesce((SELECT t.used FROM public.tutor_usage t WHERE t.user_id = u AND t.day = public.mm_today()), 0) INTO used;
  lim := CASE WHEN public.has_role(u,'teacher') THEN 10 ELSE 20 END;
  RETURN jsonb_build_object('signed_in', true, 'daily_limit', lim, 'daily_left', greatest(lim - used, 0),
    'bonus_left', w.bonus_left, 'scholarship', w.scholarship,
    'unlimited', public.is_admin(u) OR w.scholarship = 'approved');
END $$;

CREATE OR REPLACE FUNCTION public.consume_tutor_message() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE u uuid := auth.uid(); q jsonb;
BEGIN
  IF u IS NULL THEN RETURN jsonb_build_object('ok', false, 'reason', 'signin'); END IF;
  q := public.tutor_quota();
  IF (q->>'unlimited')::boolean THEN RETURN jsonb_build_object('ok', true); END IF;
  IF (q->>'daily_left')::int > 0 THEN
    INSERT INTO public.tutor_usage (user_id, day, used) VALUES (u, public.mm_today(), 1)
    ON CONFLICT (user_id, day) DO UPDATE SET used = public.tutor_usage.used + 1;
    RETURN jsonb_build_object('ok', true);
  END IF;
  UPDATE public.tutor_wallets SET bonus_left = bonus_left - 1, updated_at = now() WHERE user_id = u AND bonus_left > 0;
  IF FOUND THEN RETURN jsonb_build_object('ok', true); END IF;
  RETURN jsonb_build_object('ok', false, 'reason', 'limit');
END $$;

CREATE OR REPLACE FUNCTION public.request_scholarship(_note text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (auth.uid()) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET scholarship = 'pending', scholarship_note = left(_note, 1000), updated_at = now()
  WHERE user_id = auth.uid() AND scholarship <> 'approved';
END $$;

CREATE OR REPLACE FUNCTION public.exam_quota() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE u uuid := auth.uid(); r text; lim int; used int; extra int;
BEGIN
  IF u IS NULL THEN RETURN jsonb_build_object('role','guest','limit',0,'used',0,'extra',0); END IF;
  IF public.is_admin(u) THEN r := 'admin'; lim := 1000;
  ELSIF public.has_role(u,'teacher') THEN r := 'teacher'; lim := 4;
  ELSE r := 'student'; lim := 2; END IF;
  SELECT count(*) INTO used FROM public.exam_generations
    WHERE user_id = u AND (created_at AT TIME ZONE 'Asia/Yangon')::date = public.mm_today();
  SELECT coalesce((SELECT exam_bonus_left FROM public.tutor_wallets WHERE user_id = u), 0) INTO extra;
  RETURN jsonb_build_object('role', r, 'limit', lim, 'used', used, 'extra', extra);
END $$;

CREATE OR REPLACE FUNCTION public.record_exam_generation(_unit int, _paper jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE q jsonb;
BEGIN
  q := public.exam_quota();
  IF (q->>'limit')::int = 0 THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF (q->>'used')::int >= (q->>'limit')::int THEN
    UPDATE public.tutor_wallets SET exam_bonus_left = exam_bonus_left - 1, updated_at = now()
      WHERE user_id = auth.uid() AND exam_bonus_left > 0;
    IF NOT FOUND THEN RAISE EXCEPTION 'Daily exam limit reached'; END IF;
  END IF;
  INSERT INTO public.exam_generations (user_id, unit, paper) VALUES (auth.uid(), _unit, _paper);
  RETURN public.exam_quota();
END $$;

CREATE OR REPLACE FUNCTION public.request_teacher_role(_school text, _subject text, _note text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  IF EXISTS (SELECT 1 FROM public.teacher_requests WHERE user_id = auth.uid() AND status = 'pending') THEN RAISE EXCEPTION 'Request already pending'; END IF;
  INSERT INTO public.teacher_requests (user_id, school, subject, note) VALUES (auth.uid(), left(_school,200), left(_subject,200), left(_note,1000));
END $$;

CREATE OR REPLACE FUNCTION public.admin_review_teacher(_id uuid, _approve boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r public.teacher_requests;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Admins only'; END IF;
  UPDATE public.teacher_requests SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END, reviewed_at = now(), reviewed_by = auth.uid()
    WHERE id = _id AND status = 'pending' RETURNING * INTO r;
  IF r.id IS NULL THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF _approve THEN INSERT INTO public.user_roles (user_id, role) VALUES (r.user_id, 'teacher') ON CONFLICT DO NOTHING; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.admin_review_topup(_id uuid, _approve boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r public.topup_requests;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Admins only'; END IF;
  UPDATE public.topup_requests SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END, reviewed_at = now(), reviewed_by = auth.uid()
    WHERE id = _id AND status = 'pending' RETURNING * INTO r;
  IF r.id IS NULL THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF _approve THEN
    INSERT INTO public.tutor_wallets (user_id) VALUES (r.user_id) ON CONFLICT DO NOTHING;
    IF r.kind = 'exam' THEN
      UPDATE public.tutor_wallets SET exam_bonus_left = exam_bonus_left + r.credits, updated_at = now() WHERE user_id = r.user_id;
    ELSE
      UPDATE public.tutor_wallets SET bonus_left = bonus_left + r.credits, updated_at = now() WHERE user_id = r.user_id;
    END IF;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.admin_tutor_update(_user uuid, _add_bonus int, _scholarship text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Admins only'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (_user) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET bonus_left = greatest(bonus_left + coalesce(_add_bonus,0), 0),
    scholarship = coalesce(nullif(_scholarship,''), scholarship), updated_at = now() WHERE user_id = _user;
END $$;

CREATE OR REPLACE FUNCTION public.admin_exam_credit(_user uuid, _add int) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'Admins only'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (_user) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET exam_bonus_left = greatest(exam_bonus_left + coalesce(_add,0), 0), updated_at = now() WHERE user_id = _user;
END $$;

CREATE OR REPLACE FUNCTION public.create_classroom(_name text, _subject text) RETURNS public.classrooms LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE c public.classrooms; newcode text;
BEGIN
  IF NOT (public.has_role(auth.uid(),'teacher') OR public.is_admin(auth.uid())) THEN RAISE EXCEPTION 'Teachers only'; END IF;
  LOOP
    newcode := upper(substr(md5(random()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classrooms WHERE code = newcode);
  END LOOP;
  INSERT INTO public.classrooms (teacher_id, name, subject, code) VALUES (auth.uid(), left(trim(_name),120), coalesce(nullif(trim(_subject),''),'English'), newcode) RETURNING * INTO c;
  RETURN c;
END $$;

CREATE OR REPLACE FUNCTION public.join_classroom_named(_code text, _name text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE cid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
  SELECT id INTO cid FROM public.classrooms WHERE code = upper(trim(_code));
  IF cid IS NULL THEN RAISE EXCEPTION 'Class code not found'; END IF;
  INSERT INTO public.classroom_members (classroom_id, student_id, display_name) VALUES (cid, auth.uid(), left(trim(coalesce(_name,'')),80))
  ON CONFLICT (classroom_id, student_id) DO UPDATE SET display_name = EXCLUDED.display_name;
  RETURN cid;
END $$;

CREATE OR REPLACE FUNCTION public.join_classroom(_code text) RETURNS uuid LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$ SELECT public.join_classroom_named(_code, coalesce(public.my_name(), '')) $$;

CREATE OR REPLACE FUNCTION public.my_classes() RETURNS TABLE (id uuid, name text, subject text, code text, joined_at timestamptz, teacher_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT c.id, c.name, c.subject, c.code, m.joined_at, p.full_name FROM public.classroom_members m
  JOIN public.classrooms c ON c.id = m.classroom_id LEFT JOIN public.profiles p ON p.id = c.teacher_id
  WHERE m.student_id = auth.uid() ORDER BY m.joined_at $$;

CREATE OR REPLACE FUNCTION public.classroom_roster_named(_cid uuid) RETURNS TABLE (student_id uuid, display_name text, full_name text, email text, joined_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_class_teacher(_cid) THEN RAISE EXCEPTION 'Teachers only'; END IF;
  RETURN QUERY SELECT m.student_id, m.display_name, p.full_name, p.email, m.joined_at FROM public.classroom_members m
    LEFT JOIN public.profiles p ON p.id = m.student_id WHERE m.classroom_id = _cid ORDER BY m.display_name;
END $$;

CREATE OR REPLACE FUNCTION public.classroom_roster(_cid uuid) RETURNS TABLE (student_id uuid, full_name text, email text, avatar_url text, joined_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.is_class_teacher(_cid) THEN RAISE EXCEPTION 'Teachers only'; END IF;
  RETURN QUERY SELECT m.student_id, p.full_name, p.email, p.avatar_url, m.joined_at FROM public.classroom_members m
    LEFT JOIN public.profiles p ON p.id = m.student_id WHERE m.classroom_id = _cid;
END $$;

CREATE OR REPLACE FUNCTION public.set_member_name(_cid uuid, _sid uuid, _name text) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR _sid = auth.uid()) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.classroom_members SET display_name = left(trim(_name),80) WHERE classroom_id = _cid AND student_id = _sid;
END $$;

CREATE OR REPLACE FUNCTION public.class_feed(_cid uuid) RETURNS TABLE (id uuid, author_id uuid, author_name text, is_teacher boolean, body text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR public.is_class_member(_cid)) THEN RAISE EXCEPTION 'Not a member'; END IF;
  RETURN QUERY SELECT po.id, po.author_id,
    coalesce(nullif(m.display_name,''), pr.full_name, 'Member'), po.author_id = c.teacher_id, po.body, po.created_at
    FROM public.class_posts po JOIN public.classrooms c ON c.id = po.classroom_id
    LEFT JOIN public.classroom_members m ON m.classroom_id = po.classroom_id AND m.student_id = po.author_id
    LEFT JOIN public.profiles pr ON pr.id = po.author_id
    WHERE po.classroom_id = _cid ORDER BY po.created_at DESC;
END $$;

CREATE OR REPLACE FUNCTION public.class_chat(_cid uuid, _peer uuid) RETURNS TABLE (id uuid, sender_id uuid, sender_name text, is_teacher boolean, body text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE t boolean := public.is_class_teacher(_cid); p uuid := _peer;
BEGIN
  IF NOT (t OR public.is_class_member(_cid)) THEN RAISE EXCEPTION 'Not a member'; END IF;
  IF NOT t AND p IS NOT NULL THEN p := auth.uid(); END IF;
  RETURN QUERY SELECT x.id, x.sender_id, coalesce(nullif(m.display_name,''), pr.full_name, 'Member'), x.sender_id = c.teacher_id, x.body, x.created_at
    FROM public.class_messages x JOIN public.classrooms c ON c.id = x.classroom_id
    LEFT JOIN public.classroom_members m ON m.classroom_id = x.classroom_id AND m.student_id = x.sender_id
    LEFT JOIN public.profiles pr ON pr.id = x.sender_id
    WHERE x.classroom_id = _cid AND x.peer_id IS NOT DISTINCT FROM p ORDER BY x.created_at;
END $$;

CREATE OR REPLACE FUNCTION public.class_chat_send(_cid uuid, _peer uuid, _body text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE t boolean := public.is_class_teacher(_cid); p uuid := _peer; nid uuid;
BEGIN
  IF NOT (t OR public.is_class_member(_cid)) THEN RAISE EXCEPTION 'Not a member'; END IF;
  IF NOT t AND p IS NOT NULL THEN p := auth.uid(); END IF;
  IF length(trim(_body)) = 0 THEN RAISE EXCEPTION 'Empty message'; END IF;
  INSERT INTO public.class_messages (classroom_id, sender_id, peer_id, body) VALUES (_cid, auth.uid(), p, left(_body, 2000)) RETURNING id INTO nid;
  RETURN nid;
END $$;

CREATE OR REPLACE FUNCTION public.class_chat_mark_read(_cid uuid, _thread text) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$ INSERT INTO public.class_chat_reads (classroom_id, user_id, thread, last_read_at) VALUES (_cid, auth.uid(), _thread, now())
  ON CONFLICT (classroom_id, user_id, thread) DO UPDATE SET last_read_at = now() $$;

CREATE OR REPLACE FUNCTION public.class_chat_unread(_cid uuid) RETURNS TABLE (thread text, unread int)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE t boolean := public.is_class_teacher(_cid);
BEGIN
  IF NOT (t OR public.is_class_member(_cid)) THEN RETURN; END IF;
  RETURN QUERY SELECT coalesce(x.peer_id::text, 'group') AS th, count(*)::int
    FROM public.class_messages x
    LEFT JOIN public.class_chat_reads r ON r.classroom_id = _cid AND r.user_id = auth.uid() AND r.thread = coalesce(x.peer_id::text,'group')
    WHERE x.classroom_id = _cid AND x.sender_id <> auth.uid()
      AND (t OR x.peer_id IS NULL OR x.peer_id = auth.uid())
      AND (r.last_read_at IS NULL OR x.created_at > r.last_read_at)
    GROUP BY 1;
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_open(_aid uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE a public.classroom_assignments; staff boolean; att public.class_exam_attempts; unlocked boolean;
BEGIN
  SELECT * INTO a FROM public.classroom_assignments WHERE id = _aid;
  IF a.id IS NULL THEN RAISE EXCEPTION 'Exam not found'; END IF;
  staff := public.is_class_teacher(a.classroom_id);
  IF NOT staff THEN
    IF NOT public.is_class_member(a.classroom_id) THEN RAISE EXCEPTION 'Not a member'; END IF;
    INSERT INTO public.class_exam_attempts (assignment_id, student_id) VALUES (_aid, auth.uid()) ON CONFLICT DO NOTHING;
    SELECT * INTO att FROM public.class_exam_attempts WHERE assignment_id = _aid AND student_id = auth.uid();
  END IF;
  unlocked := staff OR att.submitted_at IS NOT NULL
    OR (att.started_at IS NOT NULL AND now() > att.started_at + make_interval(mins => a.duration_minutes))
    OR (a.due_at IS NOT NULL AND now() > a.due_at);
  RETURN jsonb_build_object('id', a.id, 'title', a.title, 'instructions', a.instructions, 'due_at', a.due_at,
    'duration_minutes', a.duration_minutes, 'staff', staff, 'started_at', att.started_at, 'submitted_at', att.submitted_at,
    'key_unlocked', unlocked, 'paper', CASE WHEN unlocked THEN a.paper_data ELSE public.strip_answers(a.paper_data) END);
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_submit(_aid uuid, _paths text[]) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.class_exam_attempts SET image_paths = _paths, submitted_at = now()
    WHERE assignment_id = _aid AND student_id = auth.uid() AND submitted_at IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'Exam not started or already submitted'; END IF;
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_roster(_aid uuid) RETURNS TABLE (student_id uuid, display_name text, attempt_id uuid, started_at timestamptz,
  submitted_at timestamptz, graded_at timestamptz, image_paths text[], result jsonb, score numeric, total_marks numeric, teacher_feedback text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE cid uuid;
BEGIN
  SELECT classroom_id INTO cid FROM public.classroom_assignments WHERE id = _aid;
  IF cid IS NULL OR NOT public.is_class_teacher(cid) THEN RAISE EXCEPTION 'Teachers only'; END IF;
  RETURN QUERY SELECT m.student_id, m.display_name, t.id, t.started_at, t.submitted_at, t.graded_at, t.image_paths, t.result, t.score, t.total_marks, t.teacher_feedback
    FROM public.classroom_members m LEFT JOIN public.class_exam_attempts t ON t.assignment_id = _aid AND t.student_id = m.student_id
    WHERE m.classroom_id = cid ORDER BY m.display_name;
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_grade(_attempt uuid, _score numeric, _total numeric, _feedback text, _result jsonb) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE cid uuid;
BEGIN
  SELECT a.classroom_id INTO cid FROM public.class_exam_attempts t JOIN public.classroom_assignments a ON a.id = t.assignment_id WHERE t.id = _attempt;
  IF cid IS NULL OR NOT public.is_class_teacher(cid) THEN RAISE EXCEPTION 'Teachers only'; END IF;
  UPDATE public.class_exam_attempts SET score = _score, total_marks = _total, teacher_feedback = coalesce(_feedback,''), result = _result, graded_at = now() WHERE id = _attempt;
END $$;

CREATE OR REPLACE FUNCTION public.claim_class_exam_ai(_attempt uuid, _force boolean DEFAULT false) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE d public.class_exam_ai_drafts;
BEGIN
  SELECT * INTO d FROM public.class_exam_ai_drafts WHERE attempt_id = _attempt FOR UPDATE;
  IF d.attempt_id IS NULL THEN
    INSERT INTO public.class_exam_ai_drafts (attempt_id, status, lease_until) VALUES (_attempt, 'running', now() + interval '3 minutes');
    RETURN true;
  END IF;
  IF d.status = 'running' AND d.lease_until > now() THEN RETURN false; END IF;
  IF d.status = 'done' AND NOT _force THEN RETURN false; END IF;
  UPDATE public.class_exam_ai_drafts SET status = 'running', error = NULL, lease_until = now() + interval '3 minutes', updated_at = now() WHERE attempt_id = _attempt;
  RETURN true;
END $$;
REVOKE EXECUTE ON FUNCTION public.claim_class_exam_ai(uuid, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_class_exam_ai(uuid, boolean) TO service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "admin update profile" ON public.profiles FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "main admin manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_main_admin(auth.uid())) WITH CHECK (public.is_main_admin(auth.uid()));

ALTER TABLE public.tutor_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read wallet" ON public.tutor_wallets FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
ALTER TABLE public.tutor_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read usage" ON public.tutor_usage FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

ALTER TABLE public.tutor_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own chats" ON public.tutor_chats FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read checkout config" ON public.payment_settings FOR SELECT TO authenticated USING (id = 1 OR public.is_admin(auth.uid()));
CREATE POLICY "admin manage payment settings" ON public.payment_settings FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.topup_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read topups" ON public.topup_requests FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "create own topup" ON public.topup_requests FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending' AND reviewed_at IS NULL);

ALTER TABLE public.teacher_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read teacher req" ON public.teacher_requests FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

ALTER TABLE public.exam_generations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own generations" ON public.exam_generations FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

ALTER TABLE public.exam_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read submissions" ON public.exam_submissions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.teaches_student(user_id) OR public.is_admin(auth.uid()));
CREATE POLICY "write own submissions" ON public.exam_submissions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update own submissions" ON public.exam_submissions FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "delete own submissions" ON public.exam_submissions FOR DELETE TO authenticated USING (user_id = auth.uid());

ALTER TABLE public.exam_uploads ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read practice" ON public.practice_attempts FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.teaches_student(user_id) OR public.is_admin(auth.uid()));
CREATE POLICY "write own practice" ON public.practice_attempts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "update own practice" ON public.practice_attempts FOR UPDATE TO authenticated USING (user_id = auth.uid());

ALTER TABLE public.grammar_generated_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads grammar questions" ON public.grammar_generated_questions FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read support" ON public.support_messages FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "user sends support" ON public.support_messages FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid() AND from_admin = false) OR public.is_admin(auth.uid()));
CREATE POLICY "update support read flags" ON public.support_messages FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read active announcements" ON public.announcements FOR SELECT TO anon, authenticated USING (active OR public.is_admin(auth.uid()));
CREATE POLICY "admin manage announcements" ON public.announcements FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read classrooms" ON public.classrooms FOR SELECT TO authenticated USING (teacher_id = auth.uid() OR public.is_class_member(id) OR public.is_admin(auth.uid()));
CREATE POLICY "teacher updates classroom" ON public.classrooms FOR UPDATE TO authenticated USING (teacher_id = auth.uid());
CREATE POLICY "teacher deletes classroom" ON public.classrooms FOR DELETE TO authenticated USING (teacher_id = auth.uid() OR public.is_admin(auth.uid()));

ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read members" ON public.classroom_members FOR SELECT TO authenticated USING (student_id = auth.uid() OR public.is_class_teacher(classroom_id));
CREATE POLICY "leave or remove member" ON public.classroom_members FOR DELETE TO authenticated USING (student_id = auth.uid() OR public.is_class_teacher(classroom_id));

ALTER TABLE public.classroom_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read assignments" ON public.classroom_assignments FOR SELECT TO authenticated USING (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id));
CREATE POLICY "teacher adds assignment" ON public.classroom_assignments FOR INSERT TO authenticated WITH CHECK (public.is_class_teacher(classroom_id) AND created_by = auth.uid());
CREATE POLICY "teacher edits assignment" ON public.classroom_assignments FOR UPDATE TO authenticated USING (public.is_class_teacher(classroom_id));
CREATE POLICY "teacher deletes assignment" ON public.classroom_assignments FOR DELETE TO authenticated USING (public.is_class_teacher(classroom_id));

ALTER TABLE public.class_exam_marking_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teacher marking guides" ON public.class_exam_marking_guides FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND public.is_class_teacher(a.classroom_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND public.is_class_teacher(a.classroom_id)));

ALTER TABLE public.class_exam_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read attempts" ON public.class_exam_attempts FOR SELECT TO authenticated USING (student_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND public.is_class_teacher(a.classroom_id)));

ALTER TABLE public.class_exam_ai_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teacher reads drafts" ON public.class_exam_ai_drafts FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.class_exam_attempts t
  JOIN public.classroom_assignments a ON a.id = t.assignment_id WHERE t.id = attempt_id AND public.is_class_teacher(a.classroom_id)));

ALTER TABLE public.class_exam_ai_control ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read ai control" ON public.class_exam_ai_control FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin ai control" ON public.class_exam_ai_control FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.class_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read posts" ON public.class_posts FOR SELECT TO authenticated USING (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id));
CREATE POLICY "write posts" ON public.class_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id)));
CREATE POLICY "delete posts" ON public.class_posts FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.is_class_teacher(classroom_id));

ALTER TABLE public.class_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read messages" ON public.class_messages FOR SELECT TO authenticated USING (public.is_class_teacher(classroom_id)
  OR (public.is_class_member(classroom_id) AND (peer_id IS NULL OR peer_id = auth.uid())));
CREATE POLICY "delete messages" ON public.class_messages FOR DELETE TO authenticated USING (sender_id = auth.uid() OR (peer_id IS NULL AND public.is_class_teacher(classroom_id)));

ALTER TABLE public.class_chat_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reads" ON public.class_chat_reads FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

ALTER PUBLICATION supabase_realtime ADD TABLE public.class_messages;

CREATE POLICY "upload own exam photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'exam-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "read exam photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'exam-photos' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_admin(auth.uid())
    OR EXISTS (SELECT 1 FROM public.classroom_members m JOIN public.classrooms c ON c.id = m.classroom_id
      WHERE m.student_id::text = (storage.foldername(name))[1] AND c.teacher_id = auth.uid())));
CREATE POLICY "teachers upload class papers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'class-papers' AND (public.has_role(auth.uid(),'teacher') OR public.is_admin(auth.uid())));
CREATE POLICY "members read class papers" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'class-papers');
