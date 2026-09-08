-- Drop the overly permissive INSERT policy on security_logs
DROP POLICY IF EXISTS "Only service role can insert security logs" ON public.security_logs;

-- Create proper policy that blocks all direct inserts (log_security_event SECURITY DEFINER bypasses RLS)
CREATE POLICY "Only service role can insert security logs" 
ON public.security_logs
FOR INSERT
WITH CHECK (false);