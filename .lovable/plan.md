## Goal
Add a sign-in control to the **TopBar** (next to the cart):
- **Not signed in** → `Sign in` button → opens a small modal that asks for email and verifies via Join It (same flow used elsewhere).
- **Signed in (member)** → `Hi {FirstName}` linking to `/my-membership`, with a small dropdown to sign out.

No new auth system — this reuses the existing `MembershipContext` + `verify-joinit-membership` edge function. The only backend change is returning the member's first name from Join It and persisting it in localStorage.

---

## 1. Backend — return first name from Join It
**File:** `supabase/functions/verify-joinit-membership/index.ts`

The Join It API response (`/verify_membership`) returns membership objects that include the member's contact info. Extract first name (typical fields: `first_name`, or `contact.first_name`, falling back to splitting `name`) and include it in the success payload:

```json
{ "verified": true, "email": "...", "status": "Active", "first_name": "Cameron" }
```

Logic:
- After parsing `data`, look for `data.memberships?.[0]?.first_name` → `data.memberships?.[0]?.contact?.first_name` → `data.first_name` → first word of `data.name` / `data.memberships?.[0]?.name`.
- Always return the field (may be `null` if not found).
- For the admin test email, return `first_name: "Admin"`.

## 2. MembershipContext — store and expose first name
**File:** `src/contexts/MembershipContext.tsx`

- Extend `StoredMembership` and context with `firstName: string | null`.
- After successful verify, save `firstName` from the edge function response into localStorage and state.
- On stale re-verify, update the stored first name if the new response provides one.
- Fallback inside the context: if `firstName` is missing, derive from the email prefix (e.g. `cameron@…` → `Cameron`, capitalised) so the UI always has something to show.

Updated context type:
```ts
interface MembershipContextType {
  isMember: boolean;
  memberEmail: string | null;
  firstName: string | null;
  verifyWithJoinIt: (email: string) => Promise<boolean>;
  clearMembership: () => void;
}
```

## 3. New component — `SignInButton`
**New file:** `src/components/SignInButton.tsx`

Renders one of two states inside the TopBar:

**Not a member:**
- Button styled to match the existing TopBar text (`text-primary-foreground text-xs`, with `LogIn` icon from lucide).
- On click → opens a shadcn `Dialog` containing:
  - Title: "Sign in"
  - Email input + "Verify" button
  - Calls `verifyWithJoinIt(email)`.
  - On success → close dialog, toast `Welcome back, {firstName}`.
  - On failure → inline error: "We couldn't find an active membership for this email." with a link to `/membership-required` (existing page) for sign-up.

**Signed in:**
- `Hi {firstName}` text + small chevron, opens a shadcn `DropdownMenu` with:
  - `My Membership` → `/my-membership`
  - `Sign out` → calls `clearMembership()` + toast.

## 4. TopBar — slot the new component
**File:** `src/components/TopBar.tsx`

Place `<SignInButton />` to the **left of the cart link**, separated by a thin divider (`<span className="text-primary-foreground/30">|</span>`). Layout stays a single right-aligned cluster on desktop. On mobile (<640px), the "Your Premium Cannabis Store" tagline already feels tight — hide the tagline below `sm` so the sign-in + cart fit cleanly (current behaviour effectively does this already; we'll keep it readable).

## 5. No changes needed to
- `Header.tsx` — the existing `BECOME A MEMBER` / `MY MEMBERSHIP` nav link stays as-is (a deeper marketing CTA).
- `MembershipRequiredPage` / `MyMembershipPage` — they continue to work; the new TopBar control just provides a faster way to sign in from anywhere.
- RLS / database — no schema changes (no `members` table writes from this flow; Join It remains source of truth).

---

## Files touched
| File | Change |
|---|---|
| `supabase/functions/verify-joinit-membership/index.ts` | Return `first_name` |
| `src/contexts/MembershipContext.tsx` | Store + expose `firstName` |
| `src/components/SignInButton.tsx` | **New** — dialog + dropdown |
| `src/components/TopBar.tsx` | Render `<SignInButton />` next to cart |

## UX summary
- First-time visitor sees: `Sign in  |  🛒 0 Items`
- After verifying with their member email: `Hi Cameron ▾  |  🛒 0 Items`
- Sign out from the dropdown returns them to the `Sign in` state.