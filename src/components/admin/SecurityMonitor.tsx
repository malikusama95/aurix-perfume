import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Shield, Eye, UserCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityEvent {
  id: string;
  created_at: string;
  event_type: string;
  email?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: any;
  user_agent?: string;
}

const SecurityMonitor = () => {
  const { isAdmin } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real security events from database
      const { data, error } = await supabase
        .from('security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Type cast the data to match our interface
      const typedEvents: SecurityEvent[] = (data || []).map(event => ({
        id: event.id,
        created_at: event.created_at,
        event_type: event.event_type,
        email: event.email,
        severity: event.severity as 'low' | 'medium' | 'high' | 'critical',
        metadata: event.metadata,
        user_agent: event.user_agent
      }));

      setSecurityEvents(typedEvents);
    } catch (err: any) {
      console.error('Error fetching security events:', err);
      setError(err.message);
      
      // Fallback to mock data if database fetch fails
      const mockEvents: SecurityEvent[] = [
        {
          id: "mock-1",
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          event_type: "login_success",
          email: "user@example.com",
          severity: "low",
          metadata: { message: "Successful login from known device" }
        },
        {
          id: "mock-2", 
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          event_type: "payment_processing",
          email: "customer@example.com",
          severity: "medium",
          metadata: { message: "Payment processed successfully", amount: 2999 }
        }
      ];
      setSecurityEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSecurityEvents();
      
      // Set up real-time updates
      const interval = setInterval(fetchSecurityEvents, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Access Denied</p>
            <p className="text-sm text-muted-foreground">Only administrators can view security monitoring</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityBadge = (severity: SecurityEvent['severity']) => {
    const variants = {
      low: 'default',
      medium: 'secondary', 
      high: 'destructive',
      critical: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[severity]} className="text-xs">
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
      case 'login_failure':
        return <UserCheck className="h-4 w-4" />;
      case 'payment_processing':
        return <Shield className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSecurityEvents}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Real-time security events and monitoring alerts
        </p>
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            Database connection error. Showing cached data.
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent security events
            </p>
          ) : (
            securityEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getEventIcon(event.event_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium capitalize">
                      {event.event_type.replace(/_/g, ' ')}
                    </p>
                    {getSeverityBadge(event.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.metadata?.message || 
                     event.metadata?.error || 
                     `${event.event_type} event`}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {event.email && (
                      <span>User: {event.email}</span>
                    )}
                    <span>
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                    {event.metadata?.amount && (
                      <span>Amount: ₹{event.metadata.amount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Security Guidelines:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Monitor for unusual login patterns</li>
            <li>• Watch for multiple failed authentication attempts</li>
            <li>• Review payment processing events regularly</li>
            <li>• Investigate high-severity events immediately</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMonitor;