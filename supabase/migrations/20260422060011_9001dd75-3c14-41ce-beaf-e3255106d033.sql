-- Add a type column to group categories as 'attar' or 'perfume'
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'perfume';

-- Backfill: mark the attar slug as attar type, everything else perfume
UPDATE public.categories SET type = 'attar' WHERE slug = 'attar';
UPDATE public.categories SET type = 'perfume' WHERE slug <> 'attar';

-- Constrain allowed values
ALTER TABLE public.categories
DROP CONSTRAINT IF EXISTS categories_type_check;
ALTER TABLE public.categories
ADD CONSTRAINT categories_type_check CHECK (type IN ('attar', 'perfume'));