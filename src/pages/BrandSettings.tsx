import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, Settings } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  useSiteSettings,
  useUpdateSiteSetting,
  useCreateSiteSetting,
  useDeleteSiteSetting,
} from "@/hooks/useSiteSettings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BrandSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const { loading: rolesLoading } = useUserRoles();
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const createSetting = useCreateSiteSetting();
  const deleteSetting = useDeleteSiteSetting();

  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [newSettingOpen, setNewSettingOpen] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: "", value: "", description: "" });

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (rolesLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-serif mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleValueChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    const value = editedValues[key];
    if (value === undefined) return;

    try {
      await updateSetting.mutateAsync({ key, value });
      setEditedValues((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      toast({
        title: "Setting updated",
        description: `"${key}" has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting.",
        variant: "destructive",
      });
    }
  };

  const handleCreateSetting = async () => {
    if (!newSetting.key.trim() || !newSetting.value.trim()) {
      toast({
        title: "Validation Error",
        description: "Key and value are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSetting.mutateAsync({
        key: newSetting.key.trim().toLowerCase().replace(/\s+/g, "_"),
        value: newSetting.value.trim(),
        description: newSetting.description.trim() || undefined,
      });
      setNewSetting({ key: "", value: "", description: "" });
      setNewSettingOpen(false);
      toast({
        title: "Setting created",
        description: "New setting has been added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create setting. Key might already exist.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSetting = async (key: string) => {
    try {
      await deleteSetting.mutateAsync(key);
      toast({
        title: "Setting deleted",
        description: `"${key}" has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete setting.",
        variant: "destructive",
      });
    }
  };

  const formatKeyLabel = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-serif flex items-center gap-3">
                  <Settings className="h-8 w-8 text-primary" />
                  Brand Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your brand name and site configuration
                </p>
              </div>
            </div>

            <Dialog open={newSettingOpen} onOpenChange={setNewSettingOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Setting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Setting</DialogTitle>
                  <DialogDescription>
                    Create a new configuration setting for your site.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-key">Key</Label>
                    <Input
                      id="new-key"
                      placeholder="e.g., social_facebook"
                      value={newSetting.key}
                      onChange={(e) => setNewSetting((prev) => ({ ...prev, key: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-value">Value</Label>
                    <Input
                      id="new-value"
                      placeholder="e.g., https://facebook.com/aurix"
                      value={newSetting.value}
                      onChange={(e) => setNewSetting((prev) => ({ ...prev, value: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-description">Description (optional)</Label>
                    <Textarea
                      id="new-description"
                      placeholder="Describe what this setting is for..."
                      value={newSetting.description}
                      onChange={(e) =>
                        setNewSetting((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewSettingOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSetting} disabled={createSetting.isPending}>
                    {createSetting.isPending ? "Creating..." : "Create Setting"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {settings?.map((setting) => {
              const currentValue = editedValues[setting.key] ?? setting.value;
              const hasChanges = editedValues[setting.key] !== undefined;

              return (
                <Card key={setting.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{formatKeyLabel(setting.key)}</CardTitle>
                        {setting.description && (
                          <CardDescription>{setting.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {hasChanges && (
                          <Button
                            size="sm"
                            onClick={() => handleSave(setting.key)}
                            disabled={updateSetting.isPending}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Setting</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{formatKeyLabel(setting.key)}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSetting(setting.key)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={currentValue}
                      onChange={(e) => handleValueChange(setting.key, e.target.value)}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Key: <code className="bg-muted px-1 py-0.5 rounded">{setting.key}</code>
                    </p>
                  </CardContent>
                </Card>
              );
            })}

            {settings?.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No settings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by adding your first brand setting.
                  </p>
                  <Button onClick={() => setNewSettingOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Setting
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrandSettings;
