

# Add Test Discount Code to Checkout

## What
Add a discount code input field on the checkout page. When the code `DIVINETEST` is entered, the total drops to R10 (flat). This lets owners test the full payment flow cheaply.

## Changes — `src/pages/CheckoutPage.tsx`

1. Add state: `discountCode` (string) and `discountApplied` (boolean)
2. Add a discount code input + "Apply" button below the shipping form fields
3. When code matches `DIVINETEST` (case-insensitive), set `discountApplied = true` and show success message
4. Compute `finalTotal = discountApplied ? 10 : cartTotal`
5. Use `finalTotal` in the BobPay payment call and in the pending order localStorage
6. Show original total struck through + new R10.00 total in the order summary when discount is active
7. Show "Test discount applied" badge in order summary

No other files need changes.

