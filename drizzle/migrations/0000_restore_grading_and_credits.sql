ALTER TABLE public.class_exam_attempts
  ADD COLUMN IF NOT EXISTS score numeric,
  ADD COLUMN IF NOT EXISTS total_marks numeric,
  ADD COLUMN IF NOT EXISTS result jsonb,
  ADD COLUMN IF NOT EXISTS teacher_feedback text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS graded_at timestamptz;

CREATE OR REPLACE FUNCTION public.class_exam_roster(_aid uuid)
RETURNS TABLE(student_id uuid, display_name text, attempt_id uuid, started_at timestamptz, submitted_at timestamptz,
  image_paths text[], score numeric, total_marks numeric, result jsonb, teacher_feedback text, graded_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.classroom_assignments;
BEGIN
  SELECT * INTO a FROM public.classroom_assignments WHERE id = _aid;
  IF a.id IS NULL THEN RAISE EXCEPTION 'Exam not found'; END IF;
  IF NOT (public.is_class_teacher(a.classroom_id) OR public.has_role(auth.uid(),'admin')) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  RETURN QUERY
  SELECT m.student_id, COALESCE(NULLIF(m.display_name,''), p.full_name, p.email, 'Student')::text,
    t.id, t.started_at, t.submitted_at, COALESCE(t.image_paths,'{}'), t.score, t.total_marks, t.result,
    COALESCE(t.teacher_feedback,''), t.graded_at
  FROM public.classroom_members m
  LEFT JOIN public.profiles p ON p.id = m.student_id
  LEFT JOIN public.class_exam_attempts t ON t.assignment_id = _aid AND t.student_id = m.student_id
  ORDER BY t.submitted_at NULLS LAST, 2;
END $$;

CREATE OR REPLACE FUNCTION public.class_exam_grade(_attempt uuid, _score numeric, _total numeric, _result jsonb, _feedback text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE cid uuid;
BEGIN
  SELECT a.classroom_id INTO cid FROM public.class_exam_attempts t JOIN public.classroom_assignments a ON a.id = t.assignment_id
    WHERE t.id = _attempt AND t.submitted_at IS NOT NULL;
  IF cid IS NULL THEN RAISE EXCEPTION 'Submission not found'; END IF;
  IF NOT (public.is_class_teacher(cid) OR public.has_role(auth.uid(),'admin')) THEN RAISE EXCEPTION 'Not allowed'; END IF;
  UPDATE public.class_exam_attempts SET score = _score, total_marks = _total, result = _result,
    teacher_feedback = left(COALESCE(_feedback,''), 4000), graded_at = now() WHERE id = _attempt;
END $$;

REVOKE EXECUTE ON FUNCTION public.class_exam_roster(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.class_exam_grade(uuid, numeric, numeric, jsonb, text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.class_exam_roster(uuid), public.class_exam_grade(uuid, numeric, numeric, jsonb, text) TO authenticated;
CREATE POLICY "class teacher read exam photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'exam-photos' AND EXISTS (
    SELECT 1 FROM public.class_exam_attempts t JOIN public.classroom_assignments a ON a.id = t.assignment_id
    WHERE t.student_id::text = (storage.foldername(name))[1] AND name = ANY(t.image_paths) AND public.is_class_teacher(a.classroom_id)));

CREATE TABLE public.class_exam_ai_drafts (
  attempt_id uuid PRIMARY KEY REFERENCES public.class_exam_attempts(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  result jsonb,
  error text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.class_exam_ai_drafts TO authenticated;
GRANT ALL ON public.class_exam_ai_drafts TO service_role;
ALTER TABLE public.class_exam_ai_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teacher read ai drafts" ON public.class_exam_ai_drafts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR EXISTS (
    SELECT 1 FROM public.class_exam_attempts t JOIN public.classroom_assignments a ON a.id = t.assignment_id
    WHERE t.id = attempt_id AND public.is_class_teacher(a.classroom_id)));
CREATE POLICY "class teacher upload papers" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'class-papers' AND public.is_class_teacher(((storage.foldername(name))[1])::uuid));
CREATE POLICY "class teacher delete papers" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'class-papers' AND public.is_class_teacher(((storage.foldername(name))[1])::uuid));
CREATE POLICY "class read papers" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='class-papers' AND (public.is_class_teacher(((storage.foldername(name))[1])::uuid) OR public.has_role(auth.uid(),'admin') OR (public.is_class_member(((storage.foldername(name))[1])::uuid) AND coalesce((storage.foldername(name))[2],'') <> 'keys')));

CREATE TABLE public.class_exam_marking_guides (assignment_id uuid PRIMARY KEY REFERENCES public.classroom_assignments(id) ON DELETE CASCADE, files jsonb NOT NULL DEFAULT '[]');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_exam_marking_guides TO authenticated;
GRANT ALL ON public.class_exam_marking_guides TO service_role;
ALTER TABLE public.class_exam_marking_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY teacher_manage_guides ON public.class_exam_marking_guides FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id=assignment_id AND public.is_class_teacher(a.classroom_id))) WITH CHECK (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id=assignment_id AND public.is_class_teacher(a.classroom_id)));
CREATE TABLE public.class_exam_ai_control (id boolean PRIMARY KEY DEFAULT true CHECK(id), paused boolean NOT NULL DEFAULT false, reason text, status_code integer);
GRANT SELECT ON public.class_exam_ai_control TO authenticated;
GRANT ALL ON public.class_exam_ai_control TO service_role;
ALTER TABLE public.class_exam_ai_control ENABLE ROW LEVEL SECURITY;
CREATE POLICY staff_read_ai_control ON public.class_exam_ai_control FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR EXISTS (SELECT 1 FROM public.classrooms WHERE teacher_id=auth.uid()));
ALTER TABLE public.class_exam_ai_drafts ADD COLUMN lease_until timestamptz;
CREATE OR REPLACE FUNCTION public.claim_class_exam_ai(_attempt uuid, _force boolean DEFAULT false) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s text; lease timestamptz;
BEGIN
 INSERT INTO public.class_exam_ai_control(id) VALUES(true) ON CONFLICT DO NOTHING;
 IF EXISTS(SELECT 1 FROM public.class_exam_ai_control WHERE paused) THEN RETURN false; END IF;
 INSERT INTO public.class_exam_ai_drafts(attempt_id,status,updated_at) VALUES(_attempt,'queued',now()) ON CONFLICT DO NOTHING;
 SELECT status,lease_until INTO s,lease FROM public.class_exam_ai_drafts WHERE attempt_id=_attempt FOR UPDATE;
 IF (s='pending' AND lease>now()) OR (s='done' AND NOT _force) OR (s IN ('blocked','refused','error') AND NOT _force) THEN RETURN false; END IF;
 UPDATE public.class_exam_ai_drafts SET status='pending',error=NULL,lease_until=now()+interval '15 minutes',updated_at=now() WHERE attempt_id=_attempt;
 RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.claim_class_exam_ai(uuid,boolean) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.claim_class_exam_ai(uuid,boolean) TO service_role;
ALTER POLICY "signed in read payment settings"
ON public.payment_settings
TO authenticated
USING (
  (id = 1 AND (SELECT auth.uid()) IS NOT NULL)
  OR public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
CREATE POLICY "admin insert payment settings" ON public.payment_settings
FOR INSERT TO authenticated
WITH CHECK (id = 1 AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
GRANT SELECT, INSERT, UPDATE ON public.payment_settings TO authenticated;
ALTER TABLE public.tutor_wallets ALTER COLUMN bonus_left SET DEFAULT 5;
ALTER TABLE public.tutor_wallets ADD COLUMN IF NOT EXISTS exam_bonus_left integer NOT NULL DEFAULT 0;
ALTER TABLE public.payment_settings ADD COLUMN IF NOT EXISTS exam_packages jsonb NOT NULL DEFAULT '[{"price": 1500, "credits": 5}, {"price": 4000, "credits": 15}]'::jsonb;
ALTER TABLE public.topup_requests ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'tutor';
ALTER TABLE public.topup_requests ADD CONSTRAINT topup_kind_check CHECK (kind IN ('tutor','exam'));

CREATE OR REPLACE FUNCTION public.exam_quota()
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); n integer; role_name text; lim integer; extra integer;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('role','guest','limit',0,'used',0,'extra',0); END IF;
  IF public.has_role(uid,'admin') THEN role_name := 'admin'; lim := -1;
  ELSIF public.has_role(uid,'teacher') THEN role_name := 'teacher'; lim := 2;
  ELSE role_name := 'student'; lim := 1; END IF;
  SELECT count(*) INTO n FROM public.exam_generations
  WHERE user_id = uid AND (created_at AT TIME ZONE 'Asia/Yangon')::date = public.mm_today();
  SELECT coalesce(exam_bonus_left,0) INTO extra FROM public.tutor_wallets WHERE user_id = uid;
  RETURN json_build_object('role',role_name,'limit',lim,'used',n,'extra',coalesce(extra,0));
END $function$;

CREATE OR REPLACE FUNCTION public.record_exam_generation(_unit integer, _paper jsonb)
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE q json; uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Please sign in'; END IF;
  q := public.exam_quota();
  IF (q->>'limit')::int >= 0 AND (q->>'used')::int >= (q->>'limit')::int THEN
    UPDATE public.tutor_wallets SET exam_bonus_left = exam_bonus_left - 1, updated_at = now()
      WHERE user_id = uid AND exam_bonus_left > 0;
    IF NOT FOUND THEN RAISE EXCEPTION 'Daily limit reached'; END IF;
  END IF;
  INSERT INTO public.exam_generations (user_id, unit, paper) VALUES (uid, _unit, _paper);
  RETURN public.exam_quota();
END $function$;

CREATE OR REPLACE FUNCTION public.admin_exam_credit(_user uuid, _add integer)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (_user) ON CONFLICT DO NOTHING;
  UPDATE public.tutor_wallets SET exam_bonus_left = greatest(0, exam_bonus_left + coalesce(_add,0)), updated_at = now() WHERE user_id = _user;
END $function$;

CREATE OR REPLACE FUNCTION public.admin_review_topup(_id uuid, _approve boolean)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE r public.topup_requests;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Forbidden'; END IF;
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
END $function$;

CREATE OR REPLACE FUNCTION public.consume_tutor_message()
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); w public.tutor_wallets; used_today integer; p public.profiles;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('ok', false, 'reason', 'signin'); END IF;
  SELECT * INTO p FROM public.profiles WHERE id = uid;
  IF p.status = 'suspended' AND (p.suspended_until IS NULL OR p.suspended_until > now()) THEN
    RETURN json_build_object('ok', false, 'reason', 'suspended');
  END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
  SELECT * INTO w FROM public.tutor_wallets WHERE user_id = uid FOR UPDATE;
  IF w.scholarship = 'approved' OR public.has_role(uid, 'admin') THEN RETURN json_build_object('ok', true); END IF;
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
END $function$;

CREATE OR REPLACE FUNCTION public.tutor_quota()
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE uid uuid := auth.uid(); w public.tutor_wallets; used_today integer;
BEGIN
  IF uid IS NULL THEN RETURN json_build_object('signed_in', false); END IF;
  INSERT INTO public.tutor_wallets (user_id) VALUES (uid) ON CONFLICT DO NOTHING;
  SELECT * INTO w FROM public.tutor_wallets WHERE user_id = uid;
  SELECT coalesce(used, 0) INTO used_today FROM public.tutor_usage WHERE user_id = uid AND day = public.mm_today();
  used_today := coalesce(used_today, 0);
  RETURN json_build_object('signed_in', true,
    'unlimited', (w.scholarship = 'approved' OR public.has_role(uid, 'admin')),
    'daily_limit', 10, 'daily_left', greatest(0, 10 - used_today),
    'bonus_left', w.bonus_left, 'exam_bonus_left', w.exam_bonus_left, 'scholarship', w.scholarship);
END $function$;

GRANT EXECUTE ON FUNCTION public.admin_exam_credit(uuid, integer) TO authenticated;