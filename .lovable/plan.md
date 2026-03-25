

# BobPay Sandbox Integration Plan

## Summary
Integrate BobPay's sandbox payment links for both membership purchases (R100) and product checkout. An edge function will securely call the BobPay API and return a payment URL that the user is redirected to.

**BobPay Sandbox API**: `https://api.sandbox.bobpay.co.za`
**Recipient Account Code**: `DIV001`
**API Key**: Will be stored as a runtime secret `BOBPAY_API_KEY`

## What Changes

### 1. Enable Lovable Cloud & Store Secret
- Enable Lovable Cloud (required for edge functions)
- Store `BOBPAY_API_KEY` = `110769dbe9024c44b5338cb700915ae3` as a runtime secret

### 2. Create Edge Function: `create-bobpay-payment`
- Accepts: `amount`, `item_name`, `email`, `phone_number`, `payment_type` (membership / order)
- Generates a unique `custom_payment_id`
- Calls `POST https://api.sandbox.bobpay.co.za/payments/intents/link` with:
  - `recipient_account_code`: `"DIV001"`
  - `success_url`: site URL + `/payment-success?type={payment_type}&ref={custom_payment_id}`
  - `cancel_url`: site URL + `/payment-cancelled?type={payment_type}`
- Returns the BobPay payment URL to the frontend
- Includes CORS headers and input validation

### 3. Update Membership Checkout Page
- Keep identity verification (SA ID / passport / age gate / document upload)
- Remove mock card fields (card number, expiry, CVV)
- Replace with a single **"PAY R100 WITH BOBPAY"** button
- On click: validate identity fields → call edge function → redirect to BobPay URL
- Show loading state while creating payment link

### 4. Update Product Checkout Page
- Transform placeholder into a shipping details form (name, email, phone, address)
- Show cart summary with totals
- **"PAY WITH BOBPAY"** button → calls edge function with cart total → redirects to BobPay

### 5. Add Payment Return Pages
- **`/payment-success`** — reads `type` query param:
  - If `type=membership`: calls `purchaseMembership()` and shows membership activation confirmation
  - If `type=order`: clears cart and shows order confirmation
- **`/payment-cancelled`** — shows cancellation message with "Try Again" link back to the relevant checkout page

### 6. Update Routing (App.tsx)
- Add routes: `/payment-success`, `/payment-cancelled`

## Technical Details

### Edge Function Structure
```text
supabase/functions/create-bobpay-payment/index.ts

- CORS headers
- Input validation (amount > 0, item_name required, payment_type required)
- POST to BobPay sandbox API with Bearer auth
- Return { url } on success, { error } on failure
```

### Frontend Flow
```text
User clicks "Pay" → POST to edge function → receive BobPay URL → window.location.href = url
→ User pays on BobPay → BobPay redirects to /payment-success?type=...&ref=...
→ Membership activated or cart cleared
```

