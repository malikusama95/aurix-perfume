import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Product } from "./useProducts";

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: number;
  created_at: string;
  product?: Product;
}

export const useWishlist = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          *,
          product:products(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map the product data structure to match our frontend Product type
      return (data as any[]).map(item => ({
        ...item,
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          description: item.product.description,
          price: item.product.price,
          image: item.product.image,
          category: item.product.category,
          featured: item.product.featured,
          rating: item.product.rating,
          reviews: item.product.reviews,
          inStock: item.product.in_stock,
          fragrance: item.product.fragrance,
          size: item.product.size,
        } : undefined
      })) as WishlistItem[];
    },
    enabled: !!user,
  });
};

export const useToggleWishlist = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, isWishlisted }: { productId: number, isWishlisted: boolean }) => {
      if (!user) throw new Error("Must be logged in to wishlist items");

      if (isWishlisted) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
        
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from("wishlists")
          .insert({
            user_id: user.id,
            product_id: productId
          });
        
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist", user?.id] });
    }
  });
};
