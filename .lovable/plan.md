# Import product images from WooCommerce CSV via SKU match

## What I confirmed

The image URLs in your CSV use **`tdc1.carbonmediasolutions.com`** (with a **1** — different from the `tdc.` we tried last time). I tested one:

- `https://tdc1.carbonmediasolutions.com/wp-content/uploads/2025/01/IMG_6306-scaled.jpg` → **HTTP 200** ✅
- HTTPS works (valid SSL cert this time, unlike the other subdomain)

So this CSV is the right source. Even better: **every product in your DB has a SKU** (453/458) and **every CSV row has a SKU + image URL**. That means we can do an exact SKU join instead of the fuzzy name matching that failed before.

The CSV has **143 products** with images. The `Images` column may contain multiple URLs separated by `, ` — we'll take the first one as the primary product image.

## The plan

### 1. Add a CSV upload button to `ProductsTab.tsx`

Replace the previous "Import images from WordPress" button (which didn't work well) with:

> **"Import images from CSV"** — opens a file picker, accepts `.csv`

When you pick the file, the browser parses it client-side (no upload needed — it's only ~140 rows).

### 2. New edge function: `supabase/functions/import-csv-images/index.ts`

Receives `{ items: [{ sku, imageUrl, name }, ...] }` from the browser. For each item:

1. Look up the product by **SKU** (exact match).
2. Skip if not found, or if product already has a Supabase-hosted image (unless `force` is true).
3. **Download the image** from `tdc1.carbonmediasolutions.com` over HTTPS (15s timeout, proper User-Agent, validate `Content-Type` starts with `image/` and size > 200 bytes).
4. **Upload to Supabase Storage** bucket `product-images` at `${slug}-${timestamp}.${ext}`.
5. **Update** `products.image_url` to the new public Supabase URL.
6. Track per-row outcome.

Returns:
```json
{
  csvRows: 143,
  matchedBySku: 138,
  downloaded: 132,
  failed: 6,
  skipped: 5,         // already had good image
  notInDb: 5,         // SKU in CSV but not in products table
  results: [...]
}
```

### 3. Result dialog in admin

After the function finishes, show a dialog with:
- Summary counts
- Scrollable list of every row: ✅ downloaded / ⚠️ already had image / ❌ download failed / ❓ SKU not in DB
- "Refresh products" button that re-runs the products query so new images appear immediately

### 4. Edge case handling

- **CSV with multiple images per product**: Split the `Images` cell on `, ` and take the first. (We can add a v2 later that stores all images for a gallery.)
- **CSV BOM**: Handle the `\ufeff` byte at the start of the file (visible in your CSV).
- **CSV quoted fields**: Use a proper CSV parser (`papaparse` — small, well-tested) since the Description column contains tons of commas inside quotes.
- **Products with no SKU in DB (5 of them)**: They'll fall into `notInDb` and be reported. You can manually map those later.
- **Idempotent**: Re-running won't overwrite existing Supabase-hosted images unless you check a "Force re-import" box.

### 5. Cleanup

Remove the old "Import images from WordPress" button and the `import-wp-media` edge function — it didn't work and isn't worth keeping.

## Files touched

- **NEW** `supabase/functions/import-csv-images/index.ts`
- **EDIT** `src/components/admin/ProductsTab.tsx` — replace WP button with CSV upload + parsing + result dialog
- **DELETE** `supabase/functions/import-wp-media/index.ts` (the failed attempt)
- **ADD DEP** `papaparse` (~10KB) for robust CSV parsing

No DB schema changes, no new buckets.

## What you'll do after

1. Go to `/admin` → Products tab.
2. Click **"Import images from CSV"** → pick `wc-product-export-26-4-2026-1777197913596.csv`.
3. Wait ~30–60s while it downloads ~140 images.
4. Review the report. Should successfully populate ~140 of your 458 products.
5. For the remaining ~315 products (likely the newer Lightspeed-only items), use the existing **Lightspeed Sync** button to pull those from your POS.