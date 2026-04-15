
# Hide Referral System from Customer View

## What's changing

JM wants the agent names to be **DIVINE** and **DUAN** (not JM). The referral tracking should be completely invisible to customers — no "Referred by" label, no manual referral code input at checkout. This prevents Divine's customers from discovering Duan's link and any associated discount.

## Changes

### 1. Checkout page (`CheckoutPage.tsx`) — Remove all visible referral UI
- Remove the "Referred by: AGENT" text indicator (line 151-152)
- Remove the manual "Referral Code" input field (lines 153-161)
- Keep the silent `sessionStorage` capture logic — the `referred_by` value still gets saved with the order, just invisibly

### 2. No other changes needed
- The `?ref=` URL capture in `CategoriesPage.tsx` already works silently
- The `PaymentSuccessPage.tsx` already saves `referred_by` to the database
- The admin panel still shows the agent column for your internal tracking

## Result
- Links like `?ref=DIVINE` and `?ref=DUAN` still work and silently track the agent
- Customers see nothing about referrals at checkout
- Admin panel still shows which agent referred each order

## Files
| Action | File |
|--------|------|
| Modify | `src/pages/CheckoutPage.tsx` |
