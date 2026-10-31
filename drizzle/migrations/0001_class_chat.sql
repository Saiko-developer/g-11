CREATE TABLE public.class_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  peer_id uuid,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX class_messages_thread_idx ON public.class_messages (classroom_id, peer_id, created_at);
GRANT SELECT, DELETE ON public.class_messages TO authenticated;
GRANT ALL ON public.class_messages TO service_role;
ALTER TABLE public.class_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read class messages" ON public.class_messages FOR SELECT TO authenticated
USING (
  (peer_id IS NULL AND (public.is_class_teacher(classroom_id) OR public.is_class_member(classroom_id)))
  OR (peer_id IS NOT NULL AND (peer_id = auth.uid() OR public.is_class_teacher(classroom_id)))
);
CREATE POLICY "delete class messages" ON public.class_messages FOR DELETE TO authenticated
USING (sender_id = auth.uid() OR (peer_id IS NULL AND public.is_class_teacher(classroom_id)));

CREATE TABLE public.class_chat_reads (
  user_id uuid NOT NULL,
  classroom_id uuid NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  thread text NOT NULL,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, classroom_id, thread)
);
GRANT SELECT ON public.class_chat_reads TO authenticated;
GRANT ALL ON public.class_chat_reads TO service_role;
ALTER TABLE public.class_chat_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own reads" ON public.class_chat_reads FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.class_chat_send(_cid uuid, _peer uuid, _body text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _id uuid; _t text := btrim(coalesce(_body,''));
BEGIN
  IF _t = '' OR char_length(_t) > 4000 THEN RAISE EXCEPTION 'Message must be 1-4000 characters'; END IF;
  IF _peer IS NULL THEN
    IF NOT (is_class_teacher(_cid) OR is_class_member(_cid)) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM classroom_members WHERE classroom_id=_cid AND student_id=_peer) THEN RAISE EXCEPTION 'Student not in class'; END IF;
    IF NOT (is_class_teacher(_cid) OR _peer = auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  END IF;
  INSERT INTO class_messages(classroom_id, sender_id, peer_id, body) VALUES (_cid, auth.uid(), _peer, _t) RETURNING id INTO _id;
  INSERT INTO class_chat_reads(user_id, classroom_id, thread, last_read_at)
  VALUES (auth.uid(), _cid, coalesce(_peer::text,'group'), now())
  ON CONFLICT (user_id, classroom_id, thread) DO UPDATE SET last_read_at = now();
  RETURN _id;
END $$;

CREATE OR REPLACE FUNCTION public.class_chat(_cid uuid, _peer uuid)
RETURNS TABLE(id uuid, sender_id uuid, sender_name text, is_teacher boolean, body text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _peer IS NULL THEN
    IF NOT (is_class_teacher(_cid) OR is_class_member(_cid) OR is_admin(auth.uid())) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  ELSE
    IF NOT (is_class_teacher(_cid) OR _peer = auth.uid()) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  END IF;
  RETURN QUERY
  SELECT m.id, m.sender_id,
    coalesce(nullif(cm.display_name,''), p.full_name, 'User'),
    (m.sender_id = c.teacher_id), m.body, m.created_at
  FROM class_messages m
  JOIN classrooms c ON c.id = m.classroom_id
  LEFT JOIN classroom_members cm ON cm.classroom_id = m.classroom_id AND cm.student_id = m.sender_id
  LEFT JOIN profiles p ON p.id = m.sender_id
  WHERE m.classroom_id = _cid AND m.peer_id IS NOT DISTINCT FROM _peer
  ORDER BY m.created_at ASC
  LIMIT 1000;
END $$;

CREATE OR REPLACE FUNCTION public.class_chat_mark_read(_cid uuid, _thread text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO class_chat_reads(user_id, classroom_id, thread, last_read_at)
  VALUES (auth.uid(), _cid, _thread, now())
  ON CONFLICT (user_id, classroom_id, thread) DO UPDATE SET last_read_at = now();
$$;

CREATE OR REPLACE FUNCTION public.class_chat_unread(_cid uuid)
RETURNS TABLE(thread text, unread integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(m.peer_id::text,'group') AS thread, count(*)::int
  FROM class_messages m
  LEFT JOIN class_chat_reads r ON r.user_id = auth.uid() AND r.classroom_id = m.classroom_id
       AND r.thread = coalesce(m.peer_id::text,'group')
  WHERE m.classroom_id = _cid AND m.sender_id <> auth.uid()
    AND (r.last_read_at IS NULL OR m.created_at > r.last_read_at)
    AND (
      (m.peer_id IS NULL AND (is_class_teacher(_cid) OR is_class_member(_cid)))
      OR (m.peer_id IS NOT NULL AND (m.peer_id = auth.uid() OR is_class_teacher(_cid)))
    )
  GROUP BY 1;
$$;

GRANT EXECUTE ON FUNCTION public.class_chat_send(uuid,uuid,text), public.class_chat(uuid,uuid), public.class_chat_mark_read(uuid,text), public.class_chat_unread(uuid) TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.class_messages;