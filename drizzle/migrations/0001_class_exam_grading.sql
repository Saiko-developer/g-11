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