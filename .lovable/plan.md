

## Goal
Add a **"Contact Admin to Pay"** option for testing — customers place an order without paying online, then message the admin on WhatsApp to arrange payment manually.

## How it works
1. New 4th payment option on checkout: **"Pay via WhatsApp / Contact Admin"**
2. Customer places the order → order saved as `payment_status: 'awaiting_contact'`, `payment_method: 'manual'`
3. On Order Confirmation page, a big green **"Message Admin on WhatsApp"** button opens WhatsApp with a pre-filled message:
   > Hi, I just placed order ORD-1234 for ₹2,499. Please share payment details.
4. Admin receives the message, shares UPI/bank details, customer pays, admin marks the order **Paid** from the Admin Dashboard (already built).

## What gets added

### 1. New payment method tile (`PaymentForm.tsx`)
A 4th option below COD:
- Icon: WhatsApp green
- Label: "Contact Admin to Pay"
- Subtext: "Best for testing — coordinate payment directly with us"
- When selected, shows an info panel with the admin WhatsApp number and explains the flow

### 2. Admin WhatsApp number setting
- New row in `site_settings` table: `admin_whatsapp_number` (e.g. `+919876543210`)
- Editable from **Brand Settings** page
- Read via existing `useSiteSetting()` hook

### 3. Order placement (`CheckoutStepsContainer.tsx`)
- New branch for `paymentMethod: 'manual'` → saves order with `payment_status: 'awaiting_contact'`, no Stripe call
- Redirects to `/order-confirmation` with state

### 4. Order Confirmation (`OrderConfirmation.tsx`)
- New status badge: orange MessageCircle icon, "Order Placed — Contact Us to Complete Payment"
- Prominent **"Message Admin on WhatsApp"** button that opens:
  ```
  https://wa.me/<number>?text=Hi%2C%20I%20placed%20order%20ORD-XXXX%20for%20₹YYY.%20Please%20share%20payment%20details.
  ```
- Fallback "Call Admin" link with `tel:` if WhatsApp not preferred

### 5. Admin Dashboard
- "Manual / WhatsApp" badge already supported by the existing payment column (just add the label mapping)
- "Mark Paid" button already exists → no extra work

## Technical changes

**Database** (no schema change — reuse existing columns)
- Insert one `site_settings` row: `admin_whatsapp_number` with the user's number

**Frontend edits**
- `src/components/checkout/PaymentForm.tsx` — add `'manual'` to `PaymentInfo['paymentMethod']` union, add 4th radio tile + info panel
- `src/components/checkout/CheckoutStepsContainer.tsx` — branch on `'manual'`, place order with `payment_status='awaiting_contact'`
- `src/pages/OrderConfirmation.tsx` — handle new status, render WhatsApp CTA
- `src/pages/Dashboard.tsx` — add label for `manual` method + `awaiting_contact` status badge
- `src/pages/BrandSettings.tsx` — add input field for `admin_whatsapp_number`

## Why this works for testing
- No payment gateway / Stripe account needed
- Real end-to-end order flow exercised
- Admin keeps full control via existing "Mark Paid" action
- Easy to disable later by removing the radio option — orders + UI keep working

## Out of scope
- Auto-sending WhatsApp messages from the server (requires Twilio/WhatsApp Business API)
- SMS or email fallback notifications

