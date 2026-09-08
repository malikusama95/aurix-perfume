-- Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Add RLS to wishlists
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wishlist"
    ON public.wishlists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own wishlist"
    ON public.wishlists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist"
    ON public.wishlists FOR DELETE
    USING (auth.uid() = user_id);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Add RLS to product_reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product reviews"
    ON public.product_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own reviews"
    ON public.product_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.product_reviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.product_reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger function to update products table
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.products
        SET 
            rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.product_reviews WHERE product_id = NEW.product_id),
            reviews = (SELECT COUNT(*) FROM public.product_reviews WHERE product_id = NEW.product_id)
        WHERE id = NEW.product_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.products
        SET 
            rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.product_reviews WHERE product_id = OLD.product_id), 0),
            reviews = (SELECT COUNT(*) FROM public.product_reviews WHERE product_id = OLD.product_id)
        WHERE id = OLD.product_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_review_change ON public.product_reviews;
CREATE TRIGGER on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();
