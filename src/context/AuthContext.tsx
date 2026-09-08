
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { logSecurityEvent } from "@/utils/securityLogger";
import { useRateLimiter } from "@/hooks/useRateLimiter";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Security logging is handled via direct utility function to avoid circular dependency
  
  // Rate limiting for auth attempts (5 attempts per 15 minutes)
  const authRateLimit = useRateLimiter({
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000 // 30 minutes block
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Password recovery links often land on "/" (/#...) and Supabase immediately cleans the URL.
      // Redirect as soon as Supabase confirms PASSWORD_RECOVERY so users always see /reset-password.
      if (event === "PASSWORD_RECOVERY" && window.location.pathname !== "/reset-password") {
        const hash = window.location.hash || "";
        window.location.replace(`/reset-password${hash}`);
        return;
      }

      // Check if user is admin
      if (session?.user) {
        setTimeout(() => {
          checkIfAdmin();
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkIfAdmin();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIfAdmin = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Check rate limit
    if (!authRateLimit.isAllowed(email)) {
      const remainingTime = authRateLimit.getRemainingTime(email);
      const minutes = Math.ceil(remainingTime / (1000 * 60));
      
      await logSecurityEvent({
        event_type: 'login_failure',
        email,
        metadata: { reason: 'rate_limited', remaining_time: remainingTime },
        severity: 'medium'
      }).catch(console.warn);
      
      toast({
        title: "Too many attempts",
        description: `Please wait ${minutes} minutes before trying again.`,
        variant: "destructive",
      });
      throw new Error("Rate limit exceeded");
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Record failed attempt
        authRateLimit.recordAttempt(email);
        
        await logSecurityEvent({
          event_type: 'login_failure',
          email,
          metadata: { error: error.message },
          severity: 'medium'
        }).catch(console.warn);
        
        throw error;
      }
      
      // Reset rate limit on successful login
      authRateLimit.reset(email);
      
      await logSecurityEvent({
        event_type: 'login_success',
        email,
        severity: 'low'
      }).catch(console.warn);
      
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Enhanced password validation
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      // Check for basic password complexity
      if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
        throw new Error("Password must contain at least one letter and one number");
      }
      
      await logSecurityEvent({
        event_type: 'signup_attempt',
        email,
        severity: 'low'
      }).catch(console.warn);
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        await logSecurityEvent({
          event_type: 'signup_attempt',
          email,
          metadata: { error: error.message, success: false },
          severity: 'low'
        }).catch(console.warn);
        throw error;
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      await logSecurityEvent({
        event_type: 'signup_attempt',
        email,
        metadata: { error: error.message, success: false },
        severity: 'low'
      }).catch(console.warn);
      
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
