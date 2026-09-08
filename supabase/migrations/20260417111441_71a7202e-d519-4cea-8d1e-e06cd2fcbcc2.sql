-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  color TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
ON public.categories FOR SELECT
USING (is_active = true OR is_admin());

CREATE POLICY "Only admins can insert categories"
ON public.categories FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update categories"
ON public.categories FOR UPDATE
USING (is_admin());

CREATE POLICY "Only admins can delete categories"
ON public.categories FOR DELETE
USING (is_admin());

CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed existing categories
INSERT INTO public.categories (slug, name, description, image, color, sort_order) VALUES
('floral', 'Floral', 'Delicate and romantic fragrances centered around flower notes like rose, jasmine, and lily.', '/category-floral.jpg', 'bg-perfume-soft-purple', 1),
('oriental', 'Oriental', 'Rich, warm, and spicy scents featuring vanilla, amber, and exotic spices.', '/category-oriental.jpg', 'bg-amber-100', 2),
('citrus', 'Citrus', 'Refreshing and energizing fragrances with notes of lemon, orange, and bergamot.', '/category-citrus.jpg', 'bg-yellow-100', 3),
('woody', 'Woody', 'Sophisticated scents centered around sandalwood, cedar, and other rich wood notes.', '/category-woody.jpg', 'bg-amber-200', 4),
('fresh', 'Fresh', 'Clean, aquatic scents reminiscent of ocean breezes and crisp mountain air.', '/category-fresh.jpg', 'bg-blue-100', 5),
('gourmand', 'Gourmand', 'Sweet, edible scents with notes of vanilla, caramel, chocolate, and honey.', '/category-gourmand.jpg', 'bg-orange-100', 6),
('attar', 'Attar', 'Traditional Arabian perfume oils — concentrated, alcohol-free fragrances like Sanaya, Oud, Jannatul Firdaus, Mukhallat and Misk.', '/category-attar.jpg', 'bg-amber-100', 7);