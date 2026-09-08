
-- Drop existing recursive policies on user_roles
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

-- Recreate using the SECURITY DEFINER is_admin() function (no recursion, no self-reference issues)
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
  -- Block self-grant of admin role even for current admins,
  -- forcing admin escalation to be done by a different admin.
  AND NOT (user_id = auth.uid() AND role = 'admin'::public.app_role)
);

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (
  public.is_admin()
  AND NOT (user_id = auth.uid() AND role = 'admin'::public.app_role)
);

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());
