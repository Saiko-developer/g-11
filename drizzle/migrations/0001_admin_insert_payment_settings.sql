CREATE POLICY "admin insert payment settings" ON public.payment_settings
FOR INSERT TO authenticated
WITH CHECK (id = 1 AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
GRANT SELECT, INSERT, UPDATE ON public.payment_settings TO authenticated;