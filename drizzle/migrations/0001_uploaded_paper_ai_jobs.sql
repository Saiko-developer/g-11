CREATE TABLE public.class_exam_marking_guides (assignment_id uuid PRIMARY KEY REFERENCES public.classroom_assignments(id) ON DELETE CASCADE, files jsonb NOT NULL DEFAULT '[]');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.class_exam_marking_guides TO authenticated;
GRANT ALL ON public.class_exam_marking_guides TO service_role;
ALTER TABLE public.class_exam_marking_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY teacher_manage_guides ON public.class_exam_marking_guides FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id=assignment_id AND public.is_class_teacher(a.classroom_id))) WITH CHECK (EXISTS (SELECT 1 FROM public.classroom_assignments a WHERE a.id=assignment_id AND public.is_class_teacher(a.classroom_id)));
DROP POLICY "class read papers" ON storage.objects;
CREATE POLICY "class read papers" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='class-papers' AND (public.is_class_teacher(((storage.foldername(name))[1])::uuid) OR public.has_role(auth.uid(),'admin') OR (public.is_class_member(((storage.foldername(name))[1])::uuid) AND coalesce((storage.foldername(name))[2],'') <> 'keys')));
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