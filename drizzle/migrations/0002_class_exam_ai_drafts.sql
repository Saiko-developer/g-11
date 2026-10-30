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