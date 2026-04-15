

# Referral Agent Tracking System

## Recommendation

**Option A (referral links) is the best approach** — it's automatic, requires zero effort from customers, and is more reliable. We'll also add an optional referral code field at checkout as a fallback (Option B), giving you both.

The agents would share links like:
- `https://yoursite.com/categories?ref=JM` (Jean-Michel)
- `https://yoursite.com/categories?ref=DUAN` (Duan)

When a customer clicks the link and eventually checks out, the agent is automatically attached to the order. No customer action needed.

## How It Works

1. Customer clicks agent's link → `ref` parameter is captured and stored in `sessionStorage`
2. Customer browses, adds to cart, goes to checkout — the ref code follows them silently
3. At checkout, the referral agent is shown (e.g. "Referred by: JM") and saved with the order
4. An optional "Referral Code" input field is also available at checkout if the customer came without a link but has a code
5. Orders table stores the `referred_by` agent code so you can track agent performance in the admin panel

## Changes

### 1. Database — Add `referred_by` column to `orders` table
- Add a nullable `referred_by` text column to store the agent code (e.g. "JM", "DUAN")

### 2. Shop page (`CategoriesPage.tsx`) — Capture `ref` param
- On load, check for `?ref=` in the URL and save it to `sessionStorage`

### 3. Checkout page (`CheckoutPage.tsx`) — Attach referral to order
- Read referral from `sessionStorage`
- Show a small indicator if a referral is active (e.g. "Referred by: JM")
- Add an optional "Referral Code" input for manual entry as fallback
- Include `referred_by` in the pending order data saved to localStorage and sent to the database

### 4. Payment success page (`PaymentSuccessPage.tsx`) — Save referral with order
- Include the `referred_by` field when inserting the completed order

### 5. Admin page — Show referral data
- Display the `referred_by` column in the orders table so you can see which agent generated each sale

## Files
| Action | File |
|--------|------|
| Migration | Add `referred_by` column to `orders` |
| Modify | `src/pages/CategoriesPage.tsx` |
| Modify | `src/pages/CheckoutPage.tsx` |
| Modify | `src/pages/PaymentSuccessPage.tsx` |
| Modify | `src/pages/AdminPage.tsx` (if orders are shown there) |

