import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  FolderTree,
  ShoppingBag,
  Home,
  Palette,
  ShieldCheck,
  Plus,
  Eye,
  Loader2,
} from "lucide-react";

const AdminHub = () => {
  const { user } = useAuth();
  const { data: stats, isLoading } = useAdminStats();

  const tiles = [
    {
      title: "Products",
      description: "Manage your catalog",
      icon: Package,
      to: "/product-manager",
      value: stats?.products,
      suffix: "items",
    },
    {
      title: "Orders",
      description: "Pending orders to process",
      icon: ShoppingBag,
      to: "/dashboard",
      value: stats?.pendingOrders,
      suffix: stats?.totalOrders ? `of ${stats.totalOrders}` : "pending",
      highlight: (stats?.pendingOrders ?? 0) > 0,
    },
    {
      title: "Categories",
      description: "Organize your products",
      icon: FolderTree,
      to: "/category-manager",
      value: stats?.categories,
      suffix: "categories",
    },
    {
      title: "Homepage",
      description: "Hero & featured sections",
      icon: Home,
      to: "/homepage-manager",
    },
    {
      title: "Brand Settings",
      description: "Identity, contact, social",
      icon: Palette,
      to: "/brand-settings",
    },
    {
      title: "Security Logs",
      description: "Recent security events",
      icon: ShieldCheck,
      to: "/dashboard",
    },
  ];

  const greeting = user?.email?.split("@")[0] ?? "admin";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight">Admin Hub</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {greeting}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/product-manager?new=1">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/category-manager?new=1">
              <Plus className="h-4 w-4" />
              Add Category
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/dashboard">
              <Eye className="h-4 w-4" />
              View Orders
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Link key={tile.title} to={tile.to} className="group">
            <Card className="h-full transition-all group-hover:shadow-md group-hover:border-primary/40">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <tile.icon className="h-5 w-5" />
                  </div>
                  {tile.value !== undefined && (
                    <div className="text-right">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <div
                            className={`text-2xl font-semibold leading-none ${
                              tile.highlight ? "text-primary" : ""
                            }`}
                          >
                            {tile.value}
                          </div>
                          {tile.suffix && (
                            <div className="text-xs text-muted-foreground mt-1">{tile.suffix}</div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg mt-3">{tile.title}</CardTitle>
                <CardDescription>{tile.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-xs text-primary group-hover:underline">Open →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminHub;
