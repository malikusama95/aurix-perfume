import { supabase } from "@/integrations/supabase/client";

export type SecurityEventType = 
  | 'login_attempt'
  | 'login_success' 
  | 'login_failure'
  | 'signup_attempt'
  | 'password_reset_request'
  | 'role_assignment'
  | 'unauthorized_access_attempt'
  | 'payment_processing'
  | 'data_access'
  | 'admin_action';

interface SecurityEvent {
  event_type: SecurityEventType;
  user_id?: string;
  email?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const logSecurityEvent = async (event: SecurityEvent) => {
  try {
    // Get client info for better tracking
    const clientInfo = {
      user_agent: navigator.userAgent,
      user_id: event.user_id,
      email: event.email
    };

    const securityLog = {
      ...event,
      ...clientInfo
    };

    // Log to console for development
    console.warn(`[SECURITY EVENT] ${event.event_type}:`, securityLog);

    // Store in database for persistent logging
    try {
      await supabase.rpc('log_security_event', {
        p_event_type: event.event_type,
        p_user_id: clientInfo.user_id,
        p_email: clientInfo.email,
        p_ip_address: null, // Client-side can't reliably get real IP
        p_user_agent: clientInfo.user_agent,
        p_metadata: event.metadata || {},
        p_severity: event.severity
      });
    } catch (dbError) {
      console.error("Failed to persist security event to database:", dbError);
      // Continue execution - don't fail the main action if logging fails
    }

    // Trigger alerts for high/critical severity events
    if (event.severity === 'critical' || event.severity === 'high') {
      console.error(`[CRITICAL SECURITY EVENT] ${event.event_type}:`, securityLog);
      
      // In production, trigger immediate alerts (email, SMS, etc.)
      if (event.severity === 'critical') {
        // Could send to external monitoring service here
        console.error("CRITICAL SECURITY ALERT - Immediate attention required!");
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to log security event:", error);
    return false;
  }
};