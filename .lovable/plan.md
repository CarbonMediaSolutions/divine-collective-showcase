

# Migrate Membership System to Join It

## Overview
Replace the on-site membership signup/payment flow with Join It integration. The website will redirect new members to Join It and verify returning members via the Join It API.

## Changes

### 1. Add Secret: `JOINIT_ACCESS_TOKEN`
Use the `add_secret` tool to request the Join It API token from the user before proceeding.

### 2. Create Edge Function: `supabase/functions/verify-joinit-membership/index.ts`
- POST endpoint accepting `{ email: string }`
- Calls `GET https://app.joinitapi.com/api/v1/organizations/me/verify_membership?email=...` with Bearer token
- Returns `{ verified: true/false, email, status }` with CORS headers
- Comment noting where to get the token

### 3. Rewrite `src/contexts/MembershipContext.tsx`
- Remove `purchaseMembership`, `checkMembership`, `checkMembershipByEmail`, `membershipPurchasedAt`, `memberName`
- Add `verifyWithJoinIt(email): Promise<boolean>` and `clearMembership()`
- localStorage shape: `{ active, email, verifiedAt }`
- On load: restore if `verifiedAt < 24h`, else silently re-verify, else clear

### 4. Update "Become a Member" links (5 locations)
All point to `https://app.joinit.com/o/divine-collective/members` with `target="_blank" rel="noopener noreferrer"`:
- **Header** (`src/components/Header.tsx`): non-member nav link → `<a>` to Join It. When `isMember`, link to `/my-membership`. Dropdown sub-item becomes "Manage on Join It" → Join It URL
- **Footer** (`src/components/Footer.tsx`): "Become A Member" → `<a>` to Join It
- **LoungePage** (`src/pages/LoungePage.tsx`): banner button → `<a>` to Join It
- **MemberSignUpPage** (`src/pages/MemberSignUpPage.tsx`): hero button → `<a>` to Join It
- **MembershipRequiredPage**: card button → `<a>` to Join It

### 5. Rewrite `src/pages/MembershipRequiredPage.tsx`
- Top: "Become A Member" section with "JOIN NOW — R100" button → Join It (new tab)
- Divider with "OR"
- Bottom: "Already A Member?" with email input + "VERIFY MEMBERSHIP" button calling `verifyWithJoinIt`. Success → redirect to `/cart`. Failure → error message.

### 6. Update `src/pages/CartPage.tsx`
- Non-member: amber box with "JOIN NOW" (→ Join It new tab) + "VERIFY MEMBERSHIP" (→ inline email form)
- Member: green "✓ Active Member" badge (no expiry date)
- Inline verify form slides open, verifies without navigation

### 7. Rewrite `src/pages/MyMembershipPage.tsx`
- Non-member: email verify form + "Join via portal" link
- Member: ACTIVE badge, email shown, "Membership managed by Join It" note, "MANAGE MY MEMBERSHIP" button → Join It portal, "Sign out" link calling `clearMembership()`
- Remove: progress bar, days remaining, renew, MembershipCardPreview, WalletButtons, MembershipOrderHistory

### 8. Update `src/App.tsx`
- Remove `/membership-checkout` and `/membership-success` routes
- Remove imports for `MembershipCheckoutPage` and `MembershipSuccessPage`
- Keep `/membership-required`, `/my-membership`, `/member-sign-up-page`

### 9. Update `src/pages/PaymentCancelledPage.tsx`
- Change membership cancel link from `/membership-checkout` to Join It URL

### Files Summary

| Action | File |
|--------|------|
| Secret | `JOINIT_ACCESS_TOKEN` — request from user |
| Create | `supabase/functions/verify-joinit-membership/index.ts` |
| Rewrite | `src/contexts/MembershipContext.tsx` |
| Modify | `src/components/Header.tsx` |
| Modify | `src/components/Footer.tsx` |
| Modify | `src/pages/LoungePage.tsx` |
| Modify | `src/pages/MemberSignUpPage.tsx` |
| Rewrite | `src/pages/MembershipRequiredPage.tsx` |
| Modify | `src/pages/CartPage.tsx` |
| Rewrite | `src/pages/MyMembershipPage.tsx` |
| Modify | `src/App.tsx` |
| Modify | `src/pages/PaymentCancelledPage.tsx` |
| Keep | `supabase/functions/verify-membership/index.ts` (coexists) |
| Keep | `supabase/functions/create-bobpay-payment/index.ts` (used for product checkout) |

