-- Baseline for this remixed project: the database already contains the full schema
-- (25 tables, 44 RLS policies, and the SECURITY DEFINER functions) copied from the source project.
-- This migration exists only to start the Drizzle journal at 0000 for future changes.
COMMENT ON TABLE public.profiles IS 'Baseline: schema pre-existing in this project database (remixed).';

-- Restore the Auth lifecycle trigger: new Google sign-ups must get a profile, a student
-- role, and a tutor wallet through public.handle_new_user().
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();