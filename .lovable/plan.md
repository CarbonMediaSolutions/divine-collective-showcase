

# Fix Missing Product Images

## What's Happening
All product images in the catalog point to the old WordPress site (`https://thedivinecollective.co.za/wp-content/uploads/...`). On your screenshot, only the alt text shows — the images aren't loading. This is almost always one of:

1. **Hotlink protection** on the WordPress host blocking external sites from embedding images
2. **CORS / referrer policy** stripping the request
3. The WordPress media files have been moved or deleted
4. A temporary outage on the source server

The strain images that DO load are hosted on Lovable Cloud storage (Supabase) — those work because they're on your own infrastructure. The product (non-flower) images all rely on the external WP site, and those are what's broken.

## Where Images Live Today
| Source | Location | Status |
|---|---|---|
| Flower / strain images | Lovable Cloud storage | ✅ Working |
| Edibles, Vapes, Accessories, Concentrates | `thedivinecollective.co.za` (WordPress) | ❌ Not loading |
| Category videos | `/public/videos/` (in your project) | ✅ Working |

There are **~150+ products** referencing WordPress URLs in `src/data/products.ts`.

## Recommended Fix (Plan)

### Step 1 — Diagnose first (quick check)
Open one broken image URL directly in a browser tab, e.g. `https://thedivinecollective.co.za/wp-content/uploads/2025/01/IMG_6328-scaled.jpg`. This tells us which scenario we're in:
- Loads in browser but not in app → hotlink/referrer blocking → fixable with a referrer policy meta tag (1-line fix)
- 404 / Forbidden → images are gone from WP → need re-upload
- Loads everywhere → something else, investigate further

### Step 2 — Apply the right fix

**If hotlink-blocked (most likely):**
Add `<meta name="referrer" content="no-referrer">` to `index.html`. This stops the browser from sending the WordPress site a referrer header, bypassing most hotlink protection. Zero migration needed.

**If WP images are unreachable (worst case):**
Migrate product images to Lovable Cloud storage. This means:
- Create a `product-images` storage bucket
- Write a one-off script to download each WP image and re-upload to your bucket
- Update `src/data/products.ts` to point to the new URLs
- Add an admin UI tab to upload/replace product images going forward (mirrors the existing strain image admin)

### Step 3 — Long-term: bring product image management into the admin
Right now product data lives in a static TypeScript file (`src/data/products.ts`). Strains live in the database with proper admin tooling. We should eventually move products to the database too so you can edit names, prices, images and stock from `/admin` instead of code. **Out of scope for this fix** — flag for a future task.

## Files Touched (depending on diagnosis)
| Scenario | Files |
|---|---|
| Hotlink fix | `index.html` (1 meta tag) |
| Full migration | New storage bucket migration, one-off upload script, `src/data/products.ts` rewrite, optional admin tab |

## Recommendation
Start with **Step 1 diagnosis + the 1-line referrer meta tag fix**. It's free to try and resolves the most common cause. If images still don't load, we move to migration.

