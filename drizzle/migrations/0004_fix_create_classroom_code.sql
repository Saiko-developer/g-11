CREATE OR REPLACE FUNCTION public.create_classroom(_name text, _subject text) RETURNS public.classrooms
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE c public.classrooms; _code text;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'teacher') OR public.is_admin(auth.uid())) THEN
    RAISE EXCEPTION 'Only teachers can create classrooms';
  END IF;
  LOOP
    _code := upper(substr(md5(random()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classrooms cl WHERE cl.code = _code);
  END LOOP;
  INSERT INTO public.classrooms (teacher_id, name, subject, code)
  VALUES (auth.uid(), left(trim(_name), 120), left(trim(_subject), 120), _code) RETURNING * INTO c;
  RETURN c;
END $$;