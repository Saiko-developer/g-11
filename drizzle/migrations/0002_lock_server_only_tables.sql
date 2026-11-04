DROP POLICY IF EXISTS "public read grammar questions" ON public.grammar_generated_questions;
DROP POLICY IF EXISTS "read ai control" ON public.class_exam_ai_control;
REVOKE ALL ON public.grammar_generated_questions FROM anon, authenticated;
REVOKE ALL ON public.class_exam_ai_control FROM anon, authenticated;
GRANT ALL ON public.grammar_generated_questions TO service_role;
GRANT ALL ON public.class_exam_ai_control TO service_role;