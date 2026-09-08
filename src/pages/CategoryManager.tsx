import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";
import {
  Category, CategoryInput, useCategories, useCreateCategory,
  useUpdateCategory, useDeleteCategory,
} from "@/hooks/useCategories";

const emptyForm: CategoryInput = {
  slug: "", name: "", description: "", image: "", color: "", sort_order: 0, is_active: true, type: "perfume",
};

const CategoryManager = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { loading: rolesLoading } = useUserRoles();
  const { data: categories = [], isLoading } = useCategories(true);
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryInput>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (rolesLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-serif mb-4">Access Denied</h1>
        <p className="text-gray-600">You need administrator privileges to view this page.</p>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: categories.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({
      slug: c.slug, name: c.name, description: c.description || "",
      image: c.image || "", color: c.color || "",
      sort_order: c.sort_order, is_active: c.is_active, type: c.type,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.slug.trim() || !form.name.trim()) return;
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, ...form });
    } else {
      await createMut.mutateAsync(form);
    }
    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMut.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif">Category Manager</h1>
          <p className="text-gray-600 mt-1">Add, edit and reorder product categories.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> New Category
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {c.image && (
                    <img src={c.image} alt={c.name} className="w-16 h-16 rounded object-cover" />
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      {c.name}{" "}
                      {!c.is_active && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">(inactive)</span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">slug: {c.slug} · order: {c.sort_order} · type: <span className="capitalize font-medium">{c.type}</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {c.description && (
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">{c.description}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>
              Slug is the URL identifier used in product filters (e.g. <code>floral</code>).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  disabled={!!editing} />
              </div>
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={3} value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" value={form.image || ""} placeholder="/category-floral.jpg"
                onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "attar" | "perfume" })}
                >
                  <option value="perfume">Perfume</option>
                  <option value="attar">Attar</option>
                </select>
              </div>
              <div>
                <Label htmlFor="order">Sort Order</Label>
                <Input id="order" type="number" value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div>
              <Label htmlFor="color">Fallback Color Class</Label>
              <Input id="color" value={form.color || ""} placeholder="bg-amber-100"
                onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active (visible to customers)</Label>
              <Switch id="active" checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>
              {(createMut.isPending || updateMut.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will not delete products, but they will no longer be filtered under this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManager;
