-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2, 1) NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  fragrance JSONB NOT NULL DEFAULT '{"topNotes": [], "middleNotes": [], "baseNotes": []}',
  size JSONB NOT NULL DEFAULT '{"value": 100, "unit": "ml"}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view products (public catalog)
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
USING (true);

-- Only admins can insert products
CREATE POLICY "Only admins can insert products"
ON public.products
FOR INSERT
WITH CHECK (is_admin());

-- Only admins can update products
CREATE POLICY "Only admins can update products"
ON public.products
FOR UPDATE
USING (is_admin());

-- Only admins can delete products
CREATE POLICY "Only admins can delete products"
ON public.products
FOR DELETE
USING (is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing products
INSERT INTO public.products (id, name, brand, description, price, image, category, featured, in_stock, rating, reviews, fragrance, size) VALUES
(1, 'Midnight Rose', 'Lumière', 'A captivating blend of Bulgarian rose and midnight jasmine, with undertones of amber and musk.', 189.99, '/perfume1.jpg', 'Floral', true, true, 4.8, 124, '{"topNotes": ["Bergamot", "Pink Pepper"], "middleNotes": ["Bulgarian Rose", "Jasmine"], "baseNotes": ["Amber", "Musk", "Sandalwood"]}', '{"value": 100, "unit": "ml"}'),
(2, 'Ocean Breeze', 'Aqua Essence', 'Fresh and invigorating, capturing the essence of sea spray and coastal gardens.', 145.00, '/perfume2.jpg', 'Fresh', true, true, 4.5, 89, '{"topNotes": ["Sea Salt", "Citrus"], "middleNotes": ["Marine Accord", "Lily of the Valley"], "baseNotes": ["Driftwood", "White Musk"]}', '{"value": 75, "unit": "ml"}'),
(3, 'Velvet Oud', 'Maison Noir', 'An opulent fragrance featuring rare oud wood, saffron, and leather notes.', 295.00, '/perfume3.jpg', 'Oriental', true, true, 4.9, 67, '{"topNotes": ["Saffron", "Cinnamon"], "middleNotes": ["Oud Wood", "Rose"], "baseNotes": ["Leather", "Amber", "Vanilla"]}', '{"value": 50, "unit": "ml"}'),
(4, 'Garden of Eden', 'Floris', 'A lush green fragrance inspired by an enchanted garden in full bloom.', 165.00, '/perfume4.jpg', 'Floral', false, true, 4.6, 53, '{"topNotes": ["Green Apple", "Pear"], "middleNotes": ["Peony", "Freesia"], "baseNotes": ["Cedar", "White Tea"]}', '{"value": 100, "unit": "ml"}'),
(5, 'Amber Nights', 'Parfum Royale', 'A warm and sensual evening fragrance with rich amber and exotic spices.', 220.00, '/perfume5.jpg', 'Oriental', true, true, 4.7, 98, '{"topNotes": ["Cardamom", "Black Pepper"], "middleNotes": ["Amber", "Incense"], "baseNotes": ["Benzoin", "Vanilla", "Sandalwood"]}', '{"value": 100, "unit": "ml"}'),
(6, 'Citrus Symphony', 'Soleil', 'A vibrant and uplifting blend of Mediterranean citrus fruits and white flowers.', 125.00, '/perfume6.jpg', 'Citrus', false, true, 4.4, 112, '{"topNotes": ["Sicilian Lemon", "Bergamot", "Grapefruit"], "middleNotes": ["Orange Blossom", "Neroli"], "baseNotes": ["White Musk", "Cedar"]}', '{"value": 75, "unit": "ml"}');

-- Reset the sequence to continue after the last inserted id
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));