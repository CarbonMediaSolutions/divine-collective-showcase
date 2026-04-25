
# Pull product images from `tdc.carbonmediasolutions.com`

## What I checked

I probed the site directly. Here's the actual situation:

| Test | Result |
|---|---|
| `tdc.carbonmediasolutions.com` homepage | ✅ Up ("Site Under Construction" landing) |
| WP REST API `/?rest_route=/wp/v2/media` | ✅ Works — **559 media items** indexed |
| WooCommerce REST `/wc/v3/products` | 🔒 Returns 401 (needs API keys) |
| `https://tdc...` (any URL) | ❌ Times out — **no valid SSL cert** on the subdomain |
| `http://tdc.../wp-content/uploads/2025/01/IMG_6328-scaled.jpg` (original product photo) | ❌ 404 — file isn't on disk |
| `http://tdc.../wp-content/uploads/2026/02/Untitled-design-...png` (newer upload) | ✅ exists |

So: the **media library still lists** the old 2025 product photos (gummies, vapes, accessories, etc.), but the actual image files for many older products were **not migrated** to the add-on hosting — only newer 2026 uploads survived. Some product images will be recoverable, others won't.

The way to find out exactly which is to script it: query the REST API for every media item, try to fetch it over plain HTTP (HTTPS doesn't work — no cert), and download whatever returns 200.

## The plan — one edge function

Create **`supabase/functions/import-wp-media/index.ts`** that:

1. **Fetches the full media list** from `http://tdc.carbonmediasolutions.com/?rest_route=/wp/v2/media` paginated 100 at a time (X-WP-Total header says 559, so ~6 pages).
2. For each media item, builds a normalized lookup name from the title and filename (lowercased, punctuation stripped) → maps to a `{ slug, source_url }` record.
3. **Loads all products** from the DB where `image_url` is empty/broken (`''`, NULL, or contains `thedivinecollective.co.za`).
4. For each such product, fuzzy-matches its `name` against the media lookup table:
   - Try exact normalized name match first.
   - Then "all words from product name appear in media title/filename" (handles WP's renamed files like `IMG_6328` not matching "Bubblegum Gummies").
   - For Flowers, also try matching against the strain name.
5. For each matched product, downloads the image over **HTTP** (force `http://`, since HTTPS has no cert), with a 10s timeout and `User-Agent` header.
6. Uploads the bytes to the existing **`product-images`** Supabase Storage bucket (already public) at `${product.slug}-${timestamp}.${ext}`.
7. Updates `products.image_url` to the new public Supabase URL.
8. Returns a JSON report: `{ matched, downloaded, failed, skipped, missingFile, results: [...] }` — so we can see exactly which products got images, which the source file is dead for, and which had no match in the media library at all.

The function uses the **service role key** (already in secrets), no auth required to invoke from admin. CORS configured for browser invocation.

## Trigger UI — small button in admin

Add a single button to **`src/components/admin/ProductsTab.tsx`** near the existing toolbar:

> **"Import images from WordPress"**

Click → invokes the edge function → shows a toast with the result counts → refetches the products query so new images appear immediately. A dialog displays the per-product result list (matched / file missing / no match) so you can see what's left.

## What this will and won't fix

✅ **Will fix**: Any product whose original image file was migrated to the add-on hosting (likely the newer 2026 items and a portion of the older ones).

❌ **Won't fix**: Products where the file is missing on the server (REST says it exists, but `http://...` returns 404 — confirmed for `IMG_6328-scaled.jpg`). For those, you'll still need either Lightspeed sync or AI-generated placeholders. The function will report exactly which ones.

❌ **Won't try HTTPS**: The subdomain has no SSL cert, so `https://tdc...` hangs. We force HTTP for the download. The re-hosted Supabase URLs are HTTPS and safe.

## Files touched

- **NEW** `supabase/functions/import-wp-media/index.ts` — the importer
- **EDIT** `src/components/admin/ProductsTab.tsx` — add the button + result dialog
- No DB schema changes, no new buckets (uses existing `product-images`)

## What you'll do after

Click the button in `/admin` → wait ~1–2 min while it crawls 559 media items and matches → review the report → for any products still without images, decide whether to leave them, sync Lightspeed, or generate AI placeholders.
