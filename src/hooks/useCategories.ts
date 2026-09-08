import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type CategoryType = "attar" | "perfume";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
  type: CategoryType;
  created_at: string;
  updated_at: string;
}

export type CategoryInput = Omit<Category, "id" | "created_at" | "updated_at">;

export const useCategories = (includeInactive = false) => {
  return useQuery({
    queryKey: ["categories", { includeInactive }],
    queryFn: async () => {
      let query = supabase.from("categories").select("*").order("sort_order");
      if (!includeInactive) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching categories from Supabase:", error.message, error.details, error.hint, error);
        throw error;
      }
      return data as Category[];
    },
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (input: CategoryInput) => {
      const { data, error } = await supabase.from("categories").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category created" });
    },
    onError: (e: Error) => toast({ title: "Failed to create", description: e.message, variant: "destructive" }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Category> & { id: string }) => {
      const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category updated" });
    },
    onError: (e: Error) => toast({ title: "Failed to update", description: e.message, variant: "destructive" }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Category deleted" });
    },
    onError: (e: Error) => toast({ title: "Failed to delete", description: e.message, variant: "destructive" }),
  });
};
