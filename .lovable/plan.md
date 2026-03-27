

# Plan: BobPay Checkout Connection + Classy Membership Page

## 1. Connect BobPay to the full e-commerce store

The BobPay integration is already connected for both membership and product checkout flows:
- **Membership checkout** (`MembershipCheckoutPage.tsx`) calls the `create-bobpay-payment` edge function with `payment_type: "membership"`
- **Product checkout** (`CheckoutPage.tsx`) calls the same edge function with `payment_type: "order"`
- **Payment success** (`PaymentSuccessPage.tsx`) handles both types, saving orders to the `orders` table

**What's missing / needs fixing:**
- The `MemberSignUpPage.tsx` currently links to `/contact` instead of `/membership-checkout` — fix this to route to the actual membership flow
- The "Renew Membership" button on `MyMembershipPage.tsx` calls `purchaseMembership()` directly (bypassing BobPay) — fix this to redirect to BobPay payment
- The `MembershipRequiredPage.tsx` "Already a member? Sign in here" is a dead link — wire it to a membership lookup (enter email to check DB)

### Changes:
- **`MemberSignUpPage.tsx`**: Change link from `/contact` to `/membership-checkout`
- **`MyMembershipPage.tsx`**: Replace `handleRenew` to redirect to BobPay via the edge function (same as membership checkout flow, but for renewal)
- **`MembershipRequiredPage.tsx`**: Add a simple email lookup modal/section for existing members to verify their membership via `checkMembershipByEmail`

---

## 2. Build a classy membership page (post-login/activation)

Redesign `MyMembershipPage.tsx` into a premium, visually rich membership dashboard:

### Design:
- **Hero banner** at top with dark gradient background, member name greeting ("Welcome back, [First Name]"), and ACTIVE badge
- **Membership card** styled like a premium card with gold/green accents:
  - Member since date
  - Expiry date
  - Days remaining with elegant circular progress indicator
  - Member ID (first 8 chars of UUID)
- **Benefits section** with icon grid showing membership perks
- **Quick actions**: Shop Now, Visit Lounge, Renew Membership
- **Order history section**: Fetch from `orders` table and display recent purchases
- Pull member name from `memberEmail` → query `members` table for first/last name

### Files modified:
- **`src/pages/MyMembershipPage.tsx`** — Full redesign (~200 lines)
- **`src/contexts/MembershipContext.tsx`** — Add `memberName` (first_name) to context, fetched alongside membership check
- **`src/pages/MemberSignUpPage.tsx`** — Fix CTA link
- **`src/pages/MembershipRequiredPage.tsx`** — Add email lookup for existing members

### Technical notes:
- Order history fetched via `supabase.from("orders").select().eq("email", memberEmail)` 
- Renew button creates a BobPay payment link via the edge function and redirects
- No new database tables or migrations needed
- All pages remain mobile responsive

