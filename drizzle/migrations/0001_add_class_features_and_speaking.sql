-- Newer columns on existing tables
ALTER TABLE public.class_exam_attempts
  ADD COLUMN score numeric,
  ADD COLUMN total_marks numeric,
  ADD COLUMN teacher_feedback text,
  ADD COLUMN graded_at timestamptz,
  ADD COLUMN result jsonb;

ALTER TABLE public.tutor_wallets ADD COLUMN exam_bonus_left integer NOT NULL DEFAULT 0;
ALTER TABLE public.payment_settings ADD COLUMN exam_packages jsonb;
ALTER TABLE public.topup_requests ADD COLUMN kind text NOT NULL DEFAULT 'tutor';

-- Announcements (admin-written, signed-in users read active ones)
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "signed in read active announcements" ON public.announcements FOR SELECT TO authenticated
  USING (active OR public.has_role(auth.uid(),'admin'));

-- Support messages between a user and admins
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  from_admin boolean NOT NULL DEFAULT false,
  body text NOT NULL,
  read_by_user boolean NOT NULL DEFAULT false,
  read_by_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX support_messages_user_idx ON public.support_messages(user_id, created_at);
GRANT SELECT, INSERT, UPDATE ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own or admin read support" ON public.support_messages FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user or admin insert support" ON public.support_messages FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid() AND NOT from_admin) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own or admin update support flags" ON public.support_messages FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- AI-generated grammar question batches (server writes with service role)
CREATE TABLE public.grammar_generated_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit integer NOT NULL,
  section_id text NOT NULL,
  batch integer NOT NULL DEFAULT 1,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX grammar_questions_section_idx ON public.grammar_generated_questions(section_id, batch);
GRANT ALL ON public.grammar_generated_questions TO service_role;
ALTER TABLE public.grammar_generated_questions ENABLE ROW LEVEL SECURITY;

-- Uploaded exam files registry (health checks)
CREATE TABLE public.exam_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.exam_uploads TO service_role;
ALTER TABLE public.exam_uploads ENABLE ROW LEVEL SECURITY;

-- Class chat messages (sending/reading via RPCs; realtime on classroom_id)
CREATE TABLE public.class_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  thread text NOT NULL DEFAULT 'group',
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX class_messages_class_idx ON public.class_messages(classroom_id, thread, created_at);
GRANT SELECT, DELETE ON public.class_messages TO authenticated;
GRANT ALL ON public.class_messages TO service_role;
ALTER TABLE public.class_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "class chat read" ON public.class_messages FOR SELECT TO authenticated
  USING (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "class chat delete" ON public.class_messages FOR DELETE TO authenticated
  USING (sender_id = auth.uid() OR public.is_class_teacher(classroom_id) OR public.has_role(auth.uid(),'admin'));

-- Class feed posts
CREATE TABLE public.class_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid(),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX class_posts_class_idx ON public.class_posts(classroom_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.class_posts TO authenticated;
GRANT ALL ON public.class_posts TO service_role;
ALTER TABLE public.class_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "class post read" ON public.class_posts FOR SELECT TO authenticated
  USING (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "class post insert" ON public.class_posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id)));
CREATE POLICY "class post delete" ON public.class_posts FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_class_teacher(classroom_id) OR public.has_role(auth.uid(),'admin'));

-- Private marking guides for uploaded class exams
CREATE TABLE public.class_exam_marking_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.classroom_assignments(id) ON DELETE CASCADE,
  files jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.class_exam_marking_guides TO authenticated;
GRANT ALL ON public.class_exam_marking_guides TO service_role;
ALTER TABLE public.class_exam_marking_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teacher read marking guides" ON public.class_exam_marking_guides FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND (public.is_class_teacher(a.classroom_id) OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "teacher insert marking guides" ON public.class_exam_marking_guides FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id = assignment_id AND (public.is_class_teacher(a.classroom_id) OR public.has_role(auth.uid(),'admin'))));

-- AI marking drafts for class exam attempts
CREATE TABLE public.class_exam_ai_drafts (
  attempt_id uuid PRIMARY KEY REFERENCES public.class_exam_attempts(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  result jsonb,
  error text,
  lease_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.class_exam_ai_drafts TO authenticated;
GRANT ALL ON public.class_exam_ai_drafts TO service_role;
ALTER TABLE public.class_exam_ai_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "draft read own or teacher" ON public.class_exam_ai_drafts FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.class_exam_attempts t
    JOIN public.classroom_assignments a ON a.id = t.assignment_id
    WHERE t.id = attempt_id
      AND (t.student_id = auth.uid() OR public.is_class_teacher(a.classroom_id) OR public.has_role(auth.uid(),'admin'))));

-- AI marking kill switch (singleton row id = true)
CREATE TABLE public.class_exam_ai_control (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  paused boolean NOT NULL DEFAULT false,
  reason text,
  status_code integer
);
GRANT ALL ON public.class_exam_ai_control TO service_role;
ALTER TABLE public.class_exam_ai_control ENABLE ROW LEVEL SECURITY;
INSERT INTO public.class_exam_ai_control (id, paused) VALUES (true, false) ON CONFLICT DO NOTHING;

-- Speaking practice sessions
CREATE TABLE public.speaking_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  unit integer NOT NULL,
  turns integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 minutes'
);
CREATE INDEX speaking_sessions_user_idx ON public.speaking_sessions(user_id, unit, created_at);
GRANT SELECT ON public.speaking_sessions TO authenticated;
GRANT ALL ON public.speaking_sessions TO service_role;
ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own speaking sessions read" ON public.speaking_sessions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Class chat RPCs
CREATE OR REPLACE FUNCTION public.class_chat(_cid uuid, _peer text)
RETURNS TABLE(id uuid, sender_id uuid, sender_name text, is_teacher boolean, body text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.id, m.sender_id,
    coalesce(nullif(cm.display_name,''), p.full_name, p.email, 'Student'),
    (m.sender_id = c.teacher_id),
    m.body, m.created_at
  FROM public.class_messages m
  JOIN public.classrooms c ON c.id = m.classroom_id
  LEFT JOIN public.classroom_members cm ON cm.classroom_id = m.classroom_id AND cm.student_id = m.sender_id
  LEFT JOIN public.profiles p ON p.id = m.sender_id
  WHERE m.classroom_id = _cid
    AND (public.is_class_teacher(_cid) OR public.is_class_member(_cid) OR public.has_role(auth.uid(),'admin'))
    AND (
      (_peer = 'group' AND m.thread = 'group')
      OR (_peer <> 'group' AND m.thread = _peer
          AND (public.is_class_teacher(_cid) OR public.has_role(auth.uid(),'admin') OR m.thread = auth.uid()::text))
    )
  ORDER BY m.created_at
$$;

CREATE OR REPLACE FUNCTION public.class_chat_send(_cid uuid, _peer text, _body text) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t text; mid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in first'; END IF;
  IF length(trim(coalesce(_body,''))) = 0 THEN RAISE EXCEPTION 'Message is empty'; END IF;
  IF NOT (public.is_class_teacher(_cid) OR public.is_class_member(_cid)) THEN RAISE EXCEPTION 'Not in this class'; END IF;
  IF _peer = 'group' THEN t := 'group';
  ELSIF public.is_class_teacher(_cid) THEN t := _peer;
  ELSE t := auth.uid()::text; END IF;
  INSERT INTO public.class_messages(classroom_id, thread, sender_id, body)
  VALUES (_cid, t, auth.uid(), left(trim(_body), 2000)) RETURNING id INTO mid;
  RETURN mid;
END $$;

CREATE OR REPLACE FUNCTION public.class_chat_mark_read(_cid uuid, _thread text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR public.is_class_member(_cid)) THEN RAISE EXCEPTION 'Not in this class'; END IF;
  UPDATE public.class_messages SET read_at = now()
  WHERE classroom_id = _cid AND read_at IS NULL AND sender_id <> auth.uid()
    AND (thread = _thread OR (_thread <> 'group' AND thread = auth.uid()::text));
END $$;

CREATE OR REPLACE FUNCTION public.class_chat_unread(_cid uuid)
RETURNS TABLE(thread text, unread integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.thread, count(*)::integer
  FROM public.class_messages m
  WHERE m.classroom_id = _cid AND m.read_at IS NULL AND m.sender_id <> auth.uid()
    AND (public.is_class_teacher(_cid) OR m.thread = 'group' OR m.thread = auth.uid()::text)
  GROUP BY m.thread
$$;

CREATE OR REPLACE FUNCTION public.class_feed(_cid uuid)
RETURNS TABLE(id uuid, author_id uuid, author_name text, is_teacher boolean, body text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.author_id,
    coalesce(nullif(cm.display_name,''), pr.full_name, pr.email, 'Member'),
    (p.author_id = c.teacher_id),
    p.body, p.created_at
  FROM public.class_posts p
  JOIN public.classrooms c ON c.id = p.classroom_id
  LEFT JOIN public.classroom_members cm ON cm.classroom_id = p.classroom_id AND cm.student_id = p.author_id
  LEFT JOIN public.profiles pr ON pr.id = p.author_id
  WHERE p.classroom_id = _cid
    AND (public.is_class_teacher(_cid) OR public.is_class_member(_cid) OR public.has_role(auth.uid(),'admin'))
  ORDER BY p.created_at DESC
$$;

-- Class exam roster for teachers: every member with their attempt state
CREATE OR REPLACE FUNCTION public.class_exam_roster(_aid uuid)
RETURNS TABLE(student_id uuid, display_name text, attempt_id uuid, started_at timestamptz, submitted_at timestamptz,
  image_paths text[], score numeric, total_marks numeric, result jsonb, teacher_feedback text, graded_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.student_id, m.display_name, t.id, t.started_at, t.submitted_at, t.image_paths,
    t.score, t.total_marks, t.result, t.teacher_feedback, t.graded_at
  FROM public.classroom_assignments a
  JOIN public.classroom_members m ON m.classroom_id = a.classroom_id
  LEFT JOIN public.class_exam_attempts t ON t.assignment_id = a.id AND t.student_id = m.student_id
  WHERE a.id = _aid AND (public.is_class_teacher(a.classroom_id) OR public.has_role(auth.uid(),'admin'))
  ORDER BY m.display_name, m.joined_at
$$;

CREATE OR REPLACE FUNCTION public.class_exam_grade(_attempt uuid, _score numeric, _total numeric, _result jsonb, _feedback text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.class_exam_attempts; cid uuid;
BEGIN
  SELECT * INTO a FROM public.class_exam_attempts WHERE id = _attempt;
  IF a.id IS NULL THEN RAISE EXCEPTION 'Attempt not found'; END IF;
  SELECT classroom_id INTO cid FROM public.classroom_assignments WHERE id = a.assignment_id;
  IF NOT (public.is_class_teacher(cid) OR public.has_role(auth.uid(),'admin')) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.class_exam_attempts SET score = _score, total_marks = _total, result = _result,
    teacher_feedback = left(coalesce(_feedback,''), 2000), graded_at = now() WHERE id = _attempt;
END $$;

-- Claim an attempt for AI marking; respects the kill switch and leases
CREATE OR REPLACE FUNCTION public.claim_class_exam_ai(_attempt uuid, _force boolean DEFAULT false) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE paused boolean;
BEGIN
  SELECT c.paused INTO paused FROM public.class_exam_ai_control c WHERE c.id = true;
  IF coalesce(paused, false) AND NOT _force THEN RETURN false; END IF;
  IF _force THEN
    INSERT INTO public.class_exam_ai_drafts(attempt_id, status, lease_until, updated_at)
    VALUES (_attempt, 'running', now() + interval '2 minutes', now())
    ON CONFLICT (attempt_id) DO UPDATE SET status = 'running', lease_until = now() + interval '2 minutes', updated_at = now(), error = NULL;
    RETURN true;
  END IF;
  INSERT INTO public.class_exam_ai_drafts(attempt_id, status, lease_until, updated_at)
  VALUES (_attempt, 'running', now() + interval '2 minutes', now())
  ON CONFLICT (attempt_id) DO NOTHING;
  IF FOUND THEN RETURN true; END IF;
  UPDATE public.class_exam_ai_drafts SET status = 'running', lease_until = now() + interval '2 minutes', updated_at = now()
  WHERE attempt_id = _attempt AND status <> 'done'
    AND (status <> 'running' OR lease_until IS NULL OR lease_until < now());
  RETURN FOUND;
END $$;

-- Speaking practice RPCs
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

-- Admin: grant exam credits
CREATE OR REPLACE FUNCTION public.admin_exam_credit(_user uuid, _add integer) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (_user) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET exam_bonus_left = greatest(0, exam_bonus_left + coalesce(_add, 0)), updated_at = now()
  WHERE user_id = _user;
END $$;

-- Exam quota now also reports purchased extra credits
CREATE OR REPLACE FUNCTION public.exam_quota() RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid(); n integer; role_name text; lim integer; extra integer;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('role', 'guest', 'limit', 0, 'used', 0, 'extra', 0); END IF;
  IF public.has_role(uid, 'admin') THEN role_name := 'admin'; lim := -1;
  ELSIF public.has_role(uid, 'teacher') THEN role_name := 'teacher'; lim := 10;
  ELSE role_name := 'student'; lim := 3; END IF;
  SELECT count(*) INTO n FROM public.exam_generations
  WHERE user_id = uid AND (created_at AT TIME ZONE 'Asia/Yangon')::date = public.mm_today();
  SELECT coalesce(w.exam_bonus_left, 0) INTO extra FROM public.tutor_wallets w WHERE w.user_id = uid;
  RETURN json_build_object('role', role_name, 'limit', lim, 'used', n, 'extra', coalesce(extra, 0));
END $$;

-- Recording a generation consumes a purchased credit once the daily limit is reached
CREATE OR REPLACE FUNCTION public.record_exam_generation(_unit integer, _paper jsonb) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE q json; extra integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Please sign in'; END IF;
  q := public.exam_quota();
  IF (q->>'limit')::int >= 0 AND (q->>'used')::int >= (q->>'limit')::int THEN
    extra := coalesce((q->>'extra')::int, 0);
    IF extra > 0 THEN
      UPDATE public.tutor_wallets SET exam_bonus_left = exam_bonus_left - 1, updated_at = now()
      WHERE user_id = auth.uid() AND exam_bonus_left > 0;
    ELSE
      RAISE EXCEPTION 'Daily limit reached';
    END IF;
  END IF;
  INSERT INTO public.exam_generations (user_id, unit, paper) VALUES (auth.uid(), _unit, _paper);
  RETURN public.exam_quota();
END $$;

-- Top-up approval credits the right wallet depending on the package kind
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
    IF r.kind = 'exam' THEN
      UPDATE public.tutor_wallets SET exam_bonus_left = exam_bonus_left + r.credits, updated_at = now() WHERE user_id = r.user_id;
    ELSE
      UPDATE public.tutor_wallets SET bonus_left = bonus_left + r.credits, updated_at = now() WHERE user_id = r.user_id;
    END IF;
  END IF;
END $$;

-- Storage policies for the class-papers bucket (exam files and marking guides)
CREATE POLICY "signed in read class papers" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'class-papers');
CREATE POLICY "signed in upload class papers" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'class-papers');
CREATE POLICY "own or admin delete class papers" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'class-papers' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));

-- Live updates for class chat
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.class_messages;
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Function permissions
REVOKE EXECUTE ON FUNCTION public.class_chat(uuid,text), public.class_chat_send(uuid,text,text),
  public.class_chat_mark_read(uuid,text), public.class_chat_unread(uuid), public.class_feed(uuid),
  public.class_exam_roster(uuid), public.class_exam_grade(uuid,numeric,numeric,jsonb,text),
  public.claim_class_exam_ai(uuid,boolean), public.speaking_unit_status(integer),
  public.start_speaking_session(integer), public.speaking_turn(uuid), public.admin_exam_credit(uuid,integer),
  public.exam_quota(), public.record_exam_generation(integer,jsonb), public.admin_review_topup(uuid,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.class_chat(uuid,text), public.class_chat_send(uuid,text,text),
  public.class_chat_mark_read(uuid,text), public.class_chat_unread(uuid), public.class_feed(uuid),
  public.class_exam_roster(uuid), public.class_exam_grade(uuid,numeric,numeric,jsonb,text),
  public.claim_class_exam_ai(uuid,boolean), public.speaking_unit_status(integer),
  public.start_speaking_session(integer), public.speaking_turn(uuid), public.admin_exam_credit(uuid,integer),
  public.exam_quota(), public.record_exam_generation(integer,jsonb), public.admin_review_topup(uuid,boolean) TO authenticated;