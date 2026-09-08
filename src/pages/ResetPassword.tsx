
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type PageState =
  | { status: "checking" }
  | { status: "ready" }
  | { status: "error"; title: string; description: string };

const decodeSupabaseError = (value: string) => {
  // Supabase puts error_description in the URL hash; it uses + for spaces.
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
};

const mapRecoveryError = (errorCode?: string | null, errorDescription?: string | null) => {
  const code = (errorCode || "").toLowerCase();

  if (code === "otp_expired") {
    return {
      title: "Reset link expired",
      description:
        "This password reset link has expired. Please request a new link and use it right away.",
    };
  }

  if (code === "access_denied") {
    return {
      title: "Access denied",
      description:
        errorDescription ||
        "We couldn't validate this password reset link. Please request a new one.",
    };
  }

  if (code) {
    return {
      title: "Password reset link error",
      description:
        errorDescription ||
        "We couldn't validate this password reset link. Please request a new one.",
    };
  }

  return null;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<PageState>({ status: "checking" });

  const recoveryContext = useMemo(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));

    const error = hashParams.get("error") || url.searchParams.get("error");
    const errorCode = hashParams.get("error_code") || url.searchParams.get("error_code");
    const rawErrorDescription =
      hashParams.get("error_description") || url.searchParams.get("error_description");
    const errorDescription = rawErrorDescription
      ? decodeSupabaseError(rawErrorDescription)
      : null;

    const code = url.searchParams.get("code");
    const type = hashParams.get("type") || url.searchParams.get("type");
    const accessToken = hashParams.get("access_token");

    return {
      code,
      type,
      accessToken,
      error,
      errorCode,
      errorDescription,
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      // 1) Handle explicit error states from Supabase (expired link, etc.)
      const mapped = mapRecoveryError(
        recoveryContext.errorCode || recoveryContext.error,
        recoveryContext.errorDescription
      );

      if (mapped) {
        setPage({ status: "error", ...mapped });
        toast({ title: mapped.title, description: mapped.description, variant: "destructive" });
        return;
      }

      // 2) Handle PKCE flow (code in query)
      try {
        if (recoveryContext.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(recoveryContext.code);
          if (error) throw error;
        }

        // 3) Ensure we have a valid session to update the password
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const hasImplicitRecovery =
          recoveryContext.type === "recovery" && !!recoveryContext.accessToken;

        if (session || hasImplicitRecovery) {
          setPage({ status: "ready" });
          return;
        }

        setPage({
          status: "error",
          title: "Invalid recovery link",
          description: "This password reset link is invalid or has expired.",
        });
      } catch (e: any) {
        const message = e?.message || "We couldn't validate this password reset link.";
        setPage({
          status: "error",
          title: "Unable to validate link",
          description: message,
        });
      }
    };

    init();
  }, [recoveryContext]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({
        title: "Password reset successful",
        description: "Your password has been updated.",
      });

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (error: any) {
      const message: string = error?.message || "Password reset failed.";

      // Common when the link is invalid/expired or session couldn't be established.
      if (message.toLowerCase().includes("auth session missing")) {
        setPage({
          status: "error",
          title: "Reset session missing",
          description:
            "We couldn't validate your reset session (the link may be expired). Please request a new password reset email.",
        });
      }

      toast({
        title: "Password reset failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (page.status === "checking") {
    return (
      <div className="container mx-auto max-w-md py-16 px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Validating link…</CardTitle>
            <CardDescription>Please wait a moment.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (page.status === "error") {
    return (
      <div className="container mx-auto max-w-md py-16 px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">{page.title}</CardTitle>
            <CardDescription>{page.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6 space-y-3">
            <Button onClick={() => navigate("/auth?tab=forgot")}>Request a new reset link</Button>
            <div>
              <Button variant="link" className="p-0" onClick={() => navigate("/auth")}>Sign in</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-16 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-perfume-purple hover:bg-perfume-purple/90"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/auth")}>Sign in</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;

