import { useAuth } from "@/context/AuthContext";
import { logSecurityEvent as logSecurityEventUtil, SecurityEventType } from "@/utils/securityLogger";

interface SecurityEvent {
  event_type: SecurityEventType;
  user_id?: string;
  email?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const useSecurityLogger = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    // Add user context from auth if not explicitly provided
    const eventWithUser = {
      ...event,
      user_id: event.user_id || user?.id,
      email: event.email || user?.email
    };
    
    return logSecurityEventUtil(eventWithUser);
  };

  const logLoginAttempt = (email: string, success: boolean, metadata?: Record<string, any>) => {
    logSecurityEvent({
      event_type: success ? 'login_success' : 'login_failure',
      email,
      metadata,
      severity: success ? 'low' : 'medium'
    });
  };

  const logUnauthorizedAccess = (attemptedAction: string, metadata?: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'unauthorized_access_attempt',
      metadata: { attempted_action: attemptedAction, ...metadata },
      severity: 'high'
    });
  };

  const logAdminAction = (action: string, targetUserId?: string, metadata?: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'admin_action',
      metadata: { 
        action, 
        target_user_id: targetUserId,
        ...metadata 
      },
      severity: 'medium'
    });
  };

  const logPaymentEvent = (action: string, amount?: number, metadata?: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'payment_processing',
      metadata: { 
        action,
        amount,
        ...metadata 
      },
      severity: 'medium'
    });
  };

  return {
    logSecurityEvent,
    logLoginAttempt,
    logUnauthorizedAccess,
    logAdminAction,
    logPaymentEvent
  };
};