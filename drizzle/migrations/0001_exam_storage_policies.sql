CREATE OR REPLACE FUNCTION public.teaches_student(_student uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (SELECT 1 FROM public.classroom_members m JOIN public.classrooms c ON c.id = m.classroom_id
    WHERE m.student_id = _student AND c.teacher_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.safe_uuid(_t text)
RETURNS uuid LANGUAGE plpgsql IMMUTABLE SET search_path TO 'public' AS $$
BEGIN RETURN _t::uuid; EXCEPTION WHEN others THEN RETURN NULL; END $$;

CREATE POLICY "class papers staff write" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'class-papers' AND (public.is_class_teacher(public.safe_uuid((storage.foldername(name))[1])) OR public.is_admin(auth.uid())));
CREATE POLICY "class papers staff update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'class-papers' AND (public.is_class_teacher(public.safe_uuid((storage.foldername(name))[1])) OR public.is_admin(auth.uid())));
CREATE POLICY "class papers staff delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'class-papers' AND (public.is_class_teacher(public.safe_uuid((storage.foldername(name))[1])) OR public.is_admin(auth.uid())));
CREATE POLICY "class papers read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'class-papers' AND (
  public.is_class_teacher(public.safe_uuid((storage.foldername(name))[1])) OR public.is_admin(auth.uid())
  OR (public.is_class_member(public.safe_uuid((storage.foldername(name))[1])) AND coalesce((storage.foldername(name))[2], '') <> 'keys')));

CREATE POLICY "exam photos own write" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'exam-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "exam photos own delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'exam-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "exam photos read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'exam-photos' AND ((storage.foldername(name))[1] = auth.uid()::text
  OR public.teaches_student(public.safe_uuid((storage.foldername(name))[1])) OR public.is_admin(auth.uid())));