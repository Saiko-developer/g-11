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
    OR (att.started_at IS NOT NULL AND now() >= att.started_at + make_interval(secs => a.duration_minutes * 30))
    OR (a.due_at IS NOT NULL AND now() > a.due_at);
  RETURN jsonb_build_object('id', a.id, 'title', a.title, 'instructions', a.instructions, 'due_at', a.due_at,
    'duration_minutes', a.duration_minutes, 'staff', staff, 'started_at', att.started_at, 'submitted_at', att.submitted_at,
    'key_unlocked', unlocked, 'paper', CASE WHEN unlocked THEN a.paper_data ELSE public.strip_answers(a.paper_data) END);
END $$;