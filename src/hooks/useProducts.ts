import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types";

interface FragranceNotes {
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
}

interface ProductSize {
  value: number;
  unit: string;
}

const mapDbProductToProduct = (dbProduct: {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: boolean;
  in_stock: boolean;
  rating: number;
  reviews: number;
  fragrance: unknown;
  size: unknown;
}): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  brand: dbProduct.brand,
  description: dbProduct.description,
  price: dbProduct.price,
  image: dbProduct.image,
  category: dbProduct.category,
  featured: dbProduct.featured,
  inStock: dbProduct.in_stock,
  rating: dbProduct.rating,
  reviews: dbProduct.reviews,
  fragrance: dbProduct.fragrance as FragranceNotes,
  size: dbProduct.size as ProductSize,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id");
      
      if (error) {
        console.error("Error fetching products from Supabase:", error.message, error.details, error.hint, error);
        throw error;
      }
      return data.map(mapDbProductToProduct);
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .order("id");
      
      if (error) {
        console.error("Error fetching featured products from Supabase:", error.message, error.details, error.hint, error);
        throw error;
      }
      return data.map(mapDbProductToProduct);
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching product by ID from Supabase:", error.message, error.details, error.hint, error);
        throw error;
      }
      if (!data) return null;
      return mapDbProductToProduct(data);
    },
    enabled: !!id,
  });
};

export const useRelatedProducts = (id: number, category: string) => {
  return useQuery({
    queryKey: ["products", "related", id, category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .neq("id", id)
        .limit(3);
      
      if (error) {
        console.error("Error fetching related products from Supabase:", error.message, error.details, error.hint, error);
        throw error;
      }
      return data.map(mapDbProductToProduct);
    },
    enabled: !!id && !!category,
  });
};
