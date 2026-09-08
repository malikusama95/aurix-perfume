-- Create site_settings table for dynamic brand configuration
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public data like brand name)
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can modify settings
CREATE POLICY "Only admins can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Only admins can delete site settings"
ON public.site_settings
FOR DELETE
USING (public.is_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default brand settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('brand_name', 'AURIX', 'The main brand name displayed across the site'),
  ('brand_tagline', 'Luxury perfumes and fragrances', 'Short tagline for the brand'),
  ('contact_email', 'contact@aurix.com', 'Contact email address'),
  ('contact_phone', '+91 1234567890', 'Contact phone number'),
  ('footer_copyright', 'AURIX. All rights reserved.', 'Footer copyright text');