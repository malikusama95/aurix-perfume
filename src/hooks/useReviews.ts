import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface Review {
  id: string;
  user_id: string;
  product_id: number;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export const useReviews = (productId: number) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      // 1. Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;
      
      if (!reviewsData || reviewsData.length === 0) {
        return [];
      }

      // 2. Fetch profiles for these reviews
      const userIds = [...new Set(reviewsData.map(r => r.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds);
        
      if (profilesError) {
        console.error("Error fetching profiles for reviews:", profilesError);
        // Continue without profiles if there's an error
      }

      // 3. Merge data
      return reviewsData.map((review) => {
        const profile = profilesData?.find(p => p.user_id === review.user_id);
        return {
          ...review,
          profiles: profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name
          } : undefined
        };
      }) as Review[];
    },
    enabled: !!productId,
  });
};

export const useAddReview = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, rating, reviewText }: { productId: number, rating: number, reviewText?: string }) => {
      if (!user) throw new Error("Must be logged in to leave a review");

      const { data, error } = await supabase
        .from("product_reviews")
        .upsert({
          user_id: user.id,
          product_id: productId,
          rating,
          review_text: reviewText || null
        }, {
          onConflict: 'user_id,product_id'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.productId] });
      // We also need to invalidate the specific product to get the new average rating
      qc.invalidateQueries({ queryKey: ["product", variables.productId.toString()] });
      qc.invalidateQueries({ queryKey: ["products"] });
    }
  });
};
