ALTER TABLE public.classroom_assignments ALTER COLUMN created_by SET DEFAULT auth.uid();
ALTER TABLE public.exam_submissions ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.tutor_chats ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.practice_attempts ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.topup_requests ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.teacher_requests ALTER COLUMN user_id SET DEFAULT auth.uid();
