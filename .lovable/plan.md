

# Plan: Digital Wallet Cards, Renewal Fix, Server-Side Verification

## 1. Digital Wallet Card Preview on /my-membership

Since both Apple Wallet (requires Apple Developer cert ~R1,500/yr) and Google Wallet (requires Google Cloud service account) need external credentials that aren't set up yet, we'll implement:

- A **visual membership card preview** styled as a premium dark-green card (#08512f) with member name, status, valid-until date, and a QR code (using a QR code library encoding the member's email)
- **"Add to Apple Wallet" button** — shows a toast: "Apple Wallet coming soon"
- **"Save to Google Wallet" button** — shows a toast: "Google Wallet coming soon — service account setup required"
- Both buttons use the standard wallet badge styling (black for Apple, white with border for Google)

When the owner is ready to set up certificates, the edge functions can be wired in behind these buttons.

### Files:
- **Install**: `qrcode.react` for QR code generation
- **Modify**: `src/pages/MyMembershipPage.tsx` — add "Your Digital Card" section with card preview + wallet buttons below the benefits grid

---

## 2. Fix Renewal Extension Bug

Currently `purchaseMembership()` always sets expiry to today + 90 days. Fix it to extend from the current expiry if still active.

### Changes in `src/contexts/MembershipContext.tsx`:
- Check `readLocalMembership()` for existing active membership
- If active with future expiry, set new expiry = existing expiry + 90 days
- If expired or new, set expiry = today + 90 days
- On renewal (when `pendingMemberData` is absent and email exists), update the existing member row instead of inserting a new one
- Reset reminder columns when they're added later

---

## 3. Server-Side Membership Verification

### New edge function: `supabase/functions/verify-membership/index.ts`
- Accepts `{ email: string }`
- Queries `members` table for active status and valid expiration
- Returns `{ valid: boolean, expiresAt: string | null }`

### Changes in `src/contexts/MembershipContext.tsx`:
- On app load, after reading localStorage, call `verify-membership` in the background
- If server says invalid but localStorage says valid, clear localStorage and set `isMember = false`
- Silent check — no UI disruption unless membership is actually invalid

---

## 4. Database Migration

Add UPDATE policy on `members` table so the renewal flow can update `expiration_date` and `status`:

```sql
CREATE POLICY "Anyone can update members"
ON public.members FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
```

---

## Summary of files

| Action | File |
|--------|------|
| Create | `supabase/functions/verify-membership/index.ts` |
| Modify | `src/pages/MyMembershipPage.tsx` (add wallet card section) |
| Modify | `src/contexts/MembershipContext.tsx` (renewal fix + server verification) |
| Migration | Add UPDATE policy on `members` table |
| Install | `qrcode.react` |

