-- Add shipping carrier column to orders table
ALTER TABLE public.orders 
ADD COLUMN shipping_carrier text;