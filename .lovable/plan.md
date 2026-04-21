

# Lightspeed Retail OAuth + Product Sync

## What to enter in the Lightspeed "Add Application" form

**Application Name:** `DivineCollective` (already filled in)

**Redirect URL:**
```
https://fthoygccccipiezsmzci.supabase.co/functions/v1/lightspeed-oauth-callback
```

This URL must match **exactly** what Lightspeed has registered (no trailing slash, no extra params). If you ever change it in Lightspeed, you must change it here too.

> Heads up: a personal access token would be much simpler (no callback URL needed, no OAuth dance), but Lightspeed only allows personal tokens on the **Plus plan**. If you're on Plus, just generate a personal token instead and skip the entire OAuth setup — much less to build.

## Build Plan (assuming OAuth route)

### 1. Save credentials as secrets
After creating the app in Lightspeed, you'll get a **Client ID** and **Client Secret**. Both stored as Lovable Cloud secrets:
- `LIGHTSPEED_CLIENT_ID`
- `LIGHTSPEED_CLIENT_SECRET`
- `LIGHTSPEED_DOMAIN_PREFIX` (set after first successful auth)

### 2. Database
New `lightspeed_tokens` table to store the access token, refresh token, expiry, and domain prefix (single-row table, only one connected store).

### 3. Edge functions (3 new)
- **`lightspeed-oauth-start`** — builds the authorization URL with a random `state` and redirects the admin to Lightspeed
- **`lightspeed-oauth-callback`** — receives `?code=...&domain_prefix=...&state=...`, exchanges the code for tokens at `https://{domain_prefix}.retail.lightspeed.app/api/1.0/token`, saves tokens to `lightspeed_tokens`, redirects back to `/admin?lightspeed=connected`
- **`sync-lightspeed-products`** — uses the saved access token (auto-refreshes if expired), pulls all products from `GET /api/2.0/products` (paginated), downloads each image to the `product-images` Lovable Cloud bucket, upserts rows into the existing `products` table by `lightspeed_id`

### 4. Admin UI additions (`src/components/admin/ProductsTab.tsx`)
- New "Lightspeed" panel at the top showing connection status
- **"Connect Lightspeed"** button → opens `/functions/v1/lightspeed-oauth-start` in a new tab
- Once connected: shows store domain prefix + last sync time + **"Sync Now"** button
- Disconnect button to clear tokens

### 5. Category mapping
Lightspeed product types won't match your shop categories (Edibles, Vapes, Concentrates, Accessories, Pre-rolls, Flower) one-to-one. After the first sync we'll see the real Lightspeed categories and add a small mapping table you can edit in admin.

## Files
| Action | File |
|---|---|
| Migration | `lightspeed_tokens` table + add `lightspeed_id` (unique) to `products` |
| Secret | `LIGHTSPEED_CLIENT_ID`, `LIGHTSPEED_CLIENT_SECRET` |
| New | `supabase/functions/lightspeed-oauth-start/index.ts` |
| New | `supabase/functions/lightspeed-oauth-callback/index.ts` |
| New | `supabase/functions/sync-lightspeed-products/index.ts` |
| Modify | `src/components/admin/ProductsTab.tsx` (Lightspeed panel) |

## Before you approve — quick check
**Are you on the Lightspeed Plus plan?** If yes, I'd strongly recommend skipping all of this and using a Personal Access Token instead. Setup is literally: paste the token into a secret, done. Tell me your plan and I'll adjust the plan accordingly.

