-- Remove sensitive payment data columns and replace with secure payment processor integration
-- This migration makes the app PCI-DSS compliant by not storing any card data

-- Drop existing sensitive columns
ALTER TABLE public.payment_methods 
  DROP COLUMN IF EXISTS card_name,
  DROP COLUMN IF EXISTS masked_card_number,
  DROP COLUMN IF EXISTS expiry_date;

-- Add secure payment processor columns
ALTER TABLE public.payment_methods
  ADD COLUMN payment_processor TEXT NOT NULL DEFAULT 'stripe',
  ADD COLUMN processor_payment_method_id TEXT NOT NULL DEFAULT 'pending_setup',
  ADD COLUMN card_brand TEXT,
  ADD COLUMN card_last4 TEXT,
  ADD COLUMN card_exp_month INTEGER,
  ADD COLUMN card_exp_year INTEGER;

-- Remove the default values after adding columns
ALTER TABLE public.payment_methods
  ALTER COLUMN payment_processor DROP DEFAULT,
  ALTER COLUMN processor_payment_method_id DROP DEFAULT;

COMMENT ON COLUMN public.payment_methods.processor_payment_method_id IS 'Stripe PaymentMethod ID (e.g., pm_1234...) - never store actual card data';
COMMENT ON COLUMN public.payment_methods.card_brand IS 'Card brand provided by payment processor (visa, mastercard, etc.)';
COMMENT ON COLUMN public.payment_methods.card_last4 IS 'Last 4 digits only - provided by payment processor';
COMMENT ON COLUMN public.payment_methods.card_exp_month IS 'Card expiration month (1-12) - provided by payment processor';
COMMENT ON COLUMN public.payment_methods.card_exp_year IS 'Card expiration year (e.g., 2025) - provided by payment processor';