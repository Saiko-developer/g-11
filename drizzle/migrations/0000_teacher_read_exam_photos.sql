CREATE OR REPLACE FUNCTION public.can_read_exam_photo(_path text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.class_exam_attempts t
    JOIN public.classroom_assignments a ON a.id = t.assignment_id
    WHERE _path = ANY(t.image_paths) AND public.is_class_teacher(a.classroom_id))
$$;
REVOKE EXECUTE ON FUNCTION public.can_read_exam_photo(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_read_exam_photo(text) TO authenticated;
CREATE POLICY "class teacher read exam photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'exam-photos' AND public.can_read_exam_photo(name));