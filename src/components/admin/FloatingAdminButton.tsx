import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ADMIN_ROUTES = [
  "/admin",
  "/dashboard",
  "/product-manager",
  "/category-manager",
  "/homepage-manager",
  "/brand-settings",
];

export const FloatingAdminButton = () => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) return null;
  if (ADMIN_ROUTES.some((r) => location.pathname.startsWith(r))) return null;

  return (
    <Link
      to="/admin"
      aria-label="Open Admin Hub"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex items-center gap-2 px-4 py-3 rounded-full",
        "bg-primary text-primary-foreground shadow-lg",
        "hover:bg-primary/90 hover:shadow-xl transition-all",
        "border border-primary-foreground/10"
      )}
    >
      <Shield className="h-4 w-4" />
      <span className="text-sm font-medium">Admin Hub</span>
    </Link>
  );
};
