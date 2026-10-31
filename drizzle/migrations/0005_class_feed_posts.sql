CREATE TABLE public.class_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  author_id uuid NOT NULL DEFAULT auth.uid(),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX class_posts_room_idx ON public.class_posts (classroom_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.class_posts TO authenticated;
GRANT ALL ON public.class_posts TO service_role;
ALTER TABLE public.class_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read class posts" ON public.class_posts FOR SELECT TO authenticated
  USING (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id) OR public.is_admin(auth.uid()));
CREATE POLICY "write class posts" ON public.class_posts FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid() AND (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id)));
CREATE POLICY "delete class posts" ON public.class_posts FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.is_class_teacher(classroom_id) OR public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.class_feed(_cid uuid)
RETURNS TABLE (id uuid, author_id uuid, author_name text, is_teacher boolean, body text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT (public.is_class_teacher(_cid) OR public.is_class_member(_cid) OR public.is_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;
  RETURN QUERY
  SELECT p.id, p.author_id,
    COALESCE(NULLIF(m.display_name, ''), pr.full_name, 'User'),
    (p.author_id = c.teacher_id), p.body, p.created_at
  FROM public.class_posts p
  JOIN public.classrooms c ON c.id = p.classroom_id
  LEFT JOIN public.classroom_members m ON m.classroom_id = p.classroom_id AND m.student_id = p.author_id
  LEFT JOIN public.profiles pr ON pr.id = p.author_id
  WHERE p.classroom_id = _cid
  ORDER BY p.created_at DESC
  LIMIT 200;
END $$;
GRANT EXECUTE ON FUNCTION public.class_feed(uuid) TO authenticated;