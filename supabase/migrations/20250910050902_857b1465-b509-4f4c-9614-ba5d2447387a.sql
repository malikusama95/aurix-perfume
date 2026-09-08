-- Fix the function search path security issue
DROP FUNCTION IF EXISTS public.log_security_event(TEXT, UUID, TEXT, TEXT, TEXT, JSONB, TEXT);

CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL,
  p_severity TEXT DEFAULT 'low'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_logs (
    event_type,
    user_id,
    email,
    ip_address,
    user_agent,
    metadata,
    severity
  ) VALUES (
    p_event_type,
    p_user_id,
    p_email,
    p_ip_address,
    p_user_agent,
    p_metadata,
    p_severity
  ) RETURNING id INTO log_id;
  
  return log_id;
END;
$$;