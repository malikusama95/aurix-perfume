INSERT INTO public.site_settings (key, value, description) VALUES
  ('shipping_fee', '400', 'Flat shipping fee in ₹ for orders below the free shipping threshold'),
  ('free_shipping_threshold', '2000', 'Minimum order subtotal in ₹ to qualify for free shipping'),
  ('tax_rate', '0.08', 'Tax rate as a decimal (e.g. 0.08 = 8%)')
ON CONFLICT DO NOTHING;