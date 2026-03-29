

# Fix: Cart Checkout Navigation + Context Stability

## Problem
The "PROCEED TO CHECKOUT" button on `/cart` doesn't work. The root cause is the same HMR context desync issue — `MembershipContext` uses `createContext(undefined)` and the hook throws when context is missing, causing a blank screen before the button can even function.

## Changes

### 1. Fix `src/contexts/MembershipContext.tsx` — Resilient context (again)
The previous fix was overwritten. Re-apply:
- Change `createContext<MembershipContextType | undefined>(undefined)` to provide a safe default value object
- Remove the `throw` from `useMembership` — just return the context directly

This is the same fix applied earlier that got reverted during subsequent edits.

### 2. Verify `/cart` → `/checkout` flow
The `handleCheckout` logic and `/checkout` route already exist and are correct. Once the context stops crashing, the button will work as expected.

## Files Modified
- `src/contexts/MembershipContext.tsx` — provide default context value, remove throw

