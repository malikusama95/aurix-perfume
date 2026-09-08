INSERT INTO public.site_settings (key, value, description)
VALUES ('merchant_upi_id', 'malikusama95@okaxis', 'Merchant UPI ID used for generating payment QR codes at checkout')
ON CONFLICT DO NOTHING;