CREATE TABLE public.tutor_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  title text NOT NULL DEFAULT 'New chat',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX tutor_chats_user_updated_idx ON public.tutor_chats (user_id, updated_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tutor_chats TO authenticated;
GRANT ALL ON public.tutor_chats TO service_role;
ALTER TABLE public.tutor_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own chats select" ON public.tutor_chats FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own chats insert" ON public.tutor_chats FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "own chats update" ON public.tutor_chats FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "own chats delete" ON public.tutor_chats FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.teacher_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  school text NOT NULL,
  subject text NOT NULL,
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid
);
GRANT SELECT ON public.teacher_requests TO authenticated;
GRANT ALL ON public.teacher_requests TO service_role;
ALTER TABLE public.teacher_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read teacher requests" ON public.teacher_requests FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX teacher_requests_user_idx ON public.teacher_requests(user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.request_teacher_role(_school text, _subject text, _note text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  IF public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Already a teacher';
  END IF;
  IF length(trim(coalesce(_school,''))) < 2 OR length(_school) > 120 THEN RAISE EXCEPTION 'Invalid school'; END IF;
  IF length(trim(coalesce(_subject,''))) < 2 OR length(_subject) > 120 THEN RAISE EXCEPTION 'Invalid subject'; END IF;
  IF length(coalesce(_note,'')) > 500 THEN RAISE EXCEPTION 'Note too long'; END IF;
  IF EXISTS (SELECT 1 FROM public.teacher_requests WHERE user_id = auth.uid() AND status = 'pending') THEN
    RAISE EXCEPTION 'Request already pending';
  END IF;
  INSERT INTO public.teacher_requests(user_id, school, subject, note)
  VALUES (auth.uid(), trim(_school), trim(_subject), nullif(trim(coalesce(_note,'')),''));
END $$;

CREATE OR REPLACE FUNCTION public.admin_review_teacher(_id uuid, _approve boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE public.teacher_requests
    SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END,
        reviewed_at = now(), reviewed_by = auth.uid()
    WHERE id = _id AND status = 'pending'
    RETURNING user_id INTO _uid;
  IF _uid IS NULL THEN RAISE EXCEPTION 'Request not found or already reviewed'; END IF;
  IF _approve THEN
    INSERT INTO public.user_roles(user_id, role) SELECT _uid, 'teacher'
    WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _uid AND role = 'teacher');
  END IF;
END $$;

REVOKE EXECUTE ON FUNCTION public.request_teacher_role(text,text,text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.admin_review_teacher(uuid,boolean) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.request_teacher_role(text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_review_teacher(uuid,boolean) TO authenticated;

CREATE TABLE public.classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  subject text NOT NULL DEFAULT '',
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.classroom_members (
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (classroom_id, student_id)
);
GRANT SELECT, UPDATE, DELETE ON public.classrooms TO authenticated;
GRANT SELECT, DELETE ON public.classroom_members TO authenticated;
GRANT ALL ON public.classrooms TO service_role;
GRANT ALL ON public.classroom_members TO service_role;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_class_teacher(_cid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.classrooms WHERE id = _cid AND teacher_id = auth.uid())
$$;
CREATE OR REPLACE FUNCTION public.is_class_member(_cid uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.classroom_members WHERE classroom_id = _cid AND student_id = auth.uid())
$$;

CREATE POLICY "class read" ON public.classrooms FOR SELECT TO authenticated
  USING (teacher_id = auth.uid() OR public.is_class_member(id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "class update own" ON public.classrooms FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "class delete own" ON public.classrooms FOR DELETE TO authenticated
  USING (teacher_id = auth.uid());
CREATE POLICY "member read" ON public.classroom_members FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_class_teacher(classroom_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "member leave or remove" ON public.classroom_members FOR DELETE TO authenticated
  USING (student_id = auth.uid() OR public.is_class_teacher(classroom_id));

CREATE OR REPLACE FUNCTION public.create_classroom(_name text, _subject text) RETURNS public.classrooms
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.classrooms; c text; i int := 0;
BEGIN
  IF auth.uid() IS NULL OR NOT (public.has_role(auth.uid(),'teacher') OR public.has_role(auth.uid(),'admin')) THEN
    RAISE EXCEPTION 'Only teachers can create classes';
  END IF;
  IF length(trim(coalesce(_name,''))) < 2 THEN RAISE EXCEPTION 'Class name is required'; END IF;
  LOOP
    c := 'OWL-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classrooms WHERE code = c);
    i := i + 1; IF i > 20 THEN RAISE EXCEPTION 'Try again'; END IF;
  END LOOP;
  INSERT INTO public.classrooms(teacher_id, name, subject, code)
  VALUES (auth.uid(), left(trim(_name),80), left(trim(coalesce(_subject,'')),80), c) RETURNING * INTO r;
  RETURN r;
END $$;

CREATE OR REPLACE FUNCTION public.join_classroom(_code text) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cid uuid; tid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  SELECT id, teacher_id INTO cid, tid FROM public.classrooms WHERE code = upper(trim(_code));
  IF cid IS NULL THEN RAISE EXCEPTION 'Class code not found'; END IF;
  IF tid = auth.uid() THEN RAISE EXCEPTION 'You are the teacher of this class'; END IF;
  INSERT INTO public.classroom_members(classroom_id, student_id) VALUES (cid, auth.uid()) ON CONFLICT DO NOTHING;
  RETURN cid;
END $$;

CREATE OR REPLACE FUNCTION public.classroom_roster(_cid uuid)
RETURNS TABLE(student_id uuid, email text, full_name text, avatar_url text, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.student_id, p.email, p.full_name, p.avatar_url, m.joined_at
  FROM public.classroom_members m LEFT JOIN public.profiles p ON p.id = m.student_id
  WHERE m.classroom_id = _cid AND (public.is_class_teacher(_cid) OR public.has_role(auth.uid(),'admin'))
  ORDER BY m.joined_at
$$;

CREATE OR REPLACE FUNCTION public.my_classes()
RETURNS TABLE(id uuid, name text, subject text, code text, teacher_name text, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.name, c.subject, c.code, coalesce(p.full_name, p.email), m.joined_at
  FROM public.classroom_members m JOIN public.classrooms c ON c.id = m.classroom_id
  LEFT JOIN public.profiles p ON p.id = c.teacher_id
  WHERE m.student_id = auth.uid() ORDER BY m.joined_at DESC
$$;

REVOKE EXECUTE ON FUNCTION public.create_classroom(text,text), public.join_classroom(text), public.classroom_roster(uuid), public.my_classes() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.create_classroom(text,text), public.join_classroom(text), public.classroom_roster(uuid), public.my_classes(), public.is_class_teacher(uuid), public.is_class_member(uuid) TO authenticated;

ALTER TABLE public.classroom_members ADD COLUMN IF NOT EXISTS display_name text NOT NULL DEFAULT '';

CREATE OR REPLACE FUNCTION public.set_my_name(_name text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  IF length(trim(coalesce(_name,''))) < 2 THEN RAISE EXCEPTION 'Name is required'; END IF;
  UPDATE public.profiles SET full_name = left(trim(_name),80) WHERE id = auth.uid();
END $$;

CREATE OR REPLACE FUNCTION public.join_classroom_named(_code text, _name text) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cid uuid; tid uuid; n text := left(trim(coalesce(_name,'')),80);
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  IF length(n) < 2 THEN RAISE EXCEPTION 'Student name is required'; END IF;
  SELECT id, teacher_id INTO cid, tid FROM public.classrooms WHERE code = upper(trim(_code));
  IF cid IS NULL THEN RAISE EXCEPTION 'Class code not found'; END IF;
  IF tid = auth.uid() THEN RAISE EXCEPTION 'You are the teacher of this class'; END IF;
  INSERT INTO public.classroom_members(classroom_id, student_id, display_name) VALUES (cid, auth.uid(), n)
    ON CONFLICT (classroom_id, student_id) DO UPDATE SET display_name = excluded.display_name;
  RETURN cid;
END $$;

CREATE OR REPLACE FUNCTION public.set_member_name(_cid uuid, _sid uuid, _name text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR public.has_role(auth.uid(),'admin')) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.classroom_members SET display_name = left(trim(coalesce(_name,'')),80)
  WHERE classroom_id = _cid AND student_id = _sid;
END $$;

CREATE OR REPLACE FUNCTION public.classroom_roster_named(_cid uuid)
RETURNS TABLE(student_id uuid, display_name text, email text, full_name text, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.student_id, m.display_name, p.email, p.full_name, m.joined_at
  FROM public.classroom_members m LEFT JOIN public.profiles p ON p.id = m.student_id
  WHERE m.classroom_id = _cid AND (public.is_class_teacher(_cid) OR public.has_role(auth.uid(),'admin'))
  ORDER BY m.display_name, m.joined_at
$$;

CREATE OR REPLACE FUNCTION public.my_name() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(full_name,'') FROM public.profiles WHERE id = auth.uid()
$$;

REVOKE EXECUTE ON FUNCTION public.set_my_name(text), public.join_classroom_named(text,text), public.set_member_name(uuid,uuid,text), public.classroom_roster_named(uuid), public.my_name() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.set_my_name(text), public.join_classroom_named(text,text), public.set_member_name(uuid,uuid,text), public.classroom_roster_named(uuid), public.my_name() TO authenticated;

CREATE TABLE public.classroom_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  kind text NOT NULL DEFAULT 'mock_exam' CHECK (kind IN ('mock_exam','practice')),
  unit integer NOT NULL CHECK (unit BETWEEN 1 AND 12),
  instructions text NOT NULL DEFAULT '',
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.classroom_assignments(classroom_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classroom_assignments TO authenticated;
GRANT ALL ON public.classroom_assignments TO service_role;
ALTER TABLE public.classroom_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignment read" ON public.classroom_assignments FOR SELECT TO authenticated
  USING (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "assignment insert" ON public.classroom_assignments FOR INSERT TO authenticated
  WITH CHECK (public.is_class_teacher(classroom_id) AND created_by = auth.uid());
CREATE POLICY "assignment update" ON public.classroom_assignments FOR UPDATE TO authenticated
  USING (public.is_class_teacher(classroom_id)) WITH CHECK (public.is_class_teacher(classroom_id));
CREATE POLICY "assignment delete" ON public.classroom_assignments FOR DELETE TO authenticated
  USING (public.is_class_teacher(classroom_id));

ALTER TABLE public.classroom_assignments ADD COLUMN paper_data jsonb, ADD COLUMN duration_minutes integer NOT NULL DEFAULT 120;
ALTER TABLE public.classroom_assignments DROP CONSTRAINT IF EXISTS classroom_assignments_kind_check;
ALTER TABLE public.classroom_assignments ADD CONSTRAINT classroom_assignments_kind_check CHECK (kind IN ('mock_exam','practice','class_exam'));

REVOKE SELECT ON public.classroom_assignments FROM authenticated;
GRANT SELECT (id, classroom_id, created_by, title, kind, unit, instructions, due_at, created_at, duration_minutes) ON public.classroom_assignments TO authenticated;

CREATE TABLE public.class_exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.classroom_assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL DEFAULT auth.uid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  image_paths text[] NOT NULL DEFAULT '{}',
  UNIQUE (assignment_id, student_id)
);
GRANT SELECT ON public.class_exam_attempts TO authenticated;
GRANT ALL ON public.class_exam_attempts TO service_role;
ALTER TABLE public.class_exam_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempt read" ON public.class_exam_attempts FOR SELECT TO authenticated
  USING (student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND public.is_class_teacher(a.classroom_id))
    OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.strip_answers(j jsonb) RETURNS jsonb
LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE r jsonb; k text; v jsonb;
BEGIN
  IF jsonb_typeof(j) = 'object' THEN
    r := '{}'::jsonb;
    FOR k, v IN SELECT * FROM jsonb_each(j) LOOP
      IF k <> 'answer' THEN r := r || jsonb_build_object(k, public.strip_answers(v)); END IF;
    END LOOP;
    RETURN r;
  ELSIF jsonb_typeof(j) = 'array' THEN
    SELECT coalesce(jsonb_agg(public.strip_answers(e)), '[]'::jsonb) INTO r FROM jsonb_array_elements(j) e;
    RETURN r;
  END IF;
  RETURN j;
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_open(_aid uuid) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.classroom_assignments; t public.class_exam_attempts; staff boolean; unlocked boolean;
BEGIN
  SELECT * INTO a FROM public.classroom_assignments WHERE id = _aid AND kind = 'class_exam';
  IF a.id IS NULL THEN RAISE EXCEPTION 'Exam not found'; END IF;
  staff := public.is_class_teacher(a.classroom_id) OR public.has_role(auth.uid(),'admin');
  IF NOT staff AND NOT public.is_class_member(a.classroom_id) THEN RAISE EXCEPTION 'Not in this class'; END IF;
  IF NOT staff THEN
    INSERT INTO public.class_exam_attempts(assignment_id, student_id) VALUES (_aid, auth.uid())
      ON CONFLICT (assignment_id, student_id) DO NOTHING;
    SELECT * INTO t FROM public.class_exam_attempts WHERE assignment_id = _aid AND student_id = auth.uid();
  END IF;
  unlocked := staff OR t.submitted_at IS NOT NULL
    OR (a.due_at IS NOT NULL AND now() > a.due_at)
    OR now() > t.started_at + make_interval(mins => a.duration_minutes);
  RETURN json_build_object(
    'id', a.id, 'title', a.title, 'instructions', a.instructions, 'due_at', a.due_at,
    'duration_minutes', a.duration_minutes, 'staff', staff,
    'started_at', t.started_at, 'submitted_at', t.submitted_at,
    'key_unlocked', unlocked,
    'paper', CASE WHEN unlocked THEN a.paper_data ELSE public.strip_answers(a.paper_data) END);
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_submit(_aid uuid, _paths text[]) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(array_length(_paths,1),0) = 0 THEN RAISE EXCEPTION 'Upload at least one page'; END IF;
  UPDATE public.class_exam_attempts SET submitted_at = now(), image_paths = _paths
    WHERE assignment_id = _aid AND student_id = auth.uid() AND submitted_at IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'Already submitted or exam not started'; END IF;
END $$;

REVOKE EXECUTE ON FUNCTION public.class_exam_open(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.class_exam_submit(uuid, text[]) FROM anon;
GRANT EXECUTE ON FUNCTION public.class_exam_open(uuid), public.class_exam_submit(uuid, text[]) TO authenticated;