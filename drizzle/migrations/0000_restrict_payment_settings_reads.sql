ALTER POLICY "signed in read payment settings"
ON public.payment_settings
TO authenticated
USING (
  (id = 1 AND (SELECT auth.uid()) IS NOT NULL)
  OR public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
COMMENT ON POLICY "signed in read payment settings" ON public.payment_settings IS
'Signed-in customers may read only the checkout configuration (id = 1); administrators may read all settings. Payment destination and package details in the checkout configuration are intentionally customer-visible.';