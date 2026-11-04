DROP POLICY IF EXISTS "read exam photos" ON storage.objects;
CREATE POLICY "read exam photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'exam-photos' AND (
    (storage.foldername(storage.objects.name))[1] = auth.uid()::text
    OR public.is_admin(auth.uid())
    OR public.teaches_student(((storage.foldername(storage.objects.name))[1])::uuid)
  ));