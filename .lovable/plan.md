

# Use Strain Images as Product Images (Properly Hosted)

## What's Actually Broken
- All 10 Flowers products have empty `image_url` fields (that's why you see grey boxes)
- The Strains table has URLs, but **9 of 10 still point to the dead WordPress site** — only Jungle Diamonds is hosted on Lovable Cloud
- That's why Jungle Diamonds is the only flower image showing in your screenshot

So a simple "copy strain URL → product URL" SQL would just give you broken images on the products too. We need to download the working images, re-host them on Lovable Cloud, and link both strains and products to the new URLs.

## Plan

### Step 1 — Re-host strain images on Lovable Cloud
A one-off edge function `migrate-strain-images`:
- Loops through all strains with a `wp-content/uploads` URL
- Fetches each image (server-side, no browser hotlink issues)
- Uploads to the existing `strain-images` storage bucket
- Updates the strain row with the new public Lovable Cloud URL
- For the 2 strains with no image at all (Maui Wowie, Watermelon), generates a clean cannabis flower image using Nano Banana and uploads that

I'll trigger it once from the admin panel via a new "Migrate strain images" button.

### Step 2 — Link Flowers products to their strain images
Database migration that runs:
```sql
UPDATE products p
SET image_url = s.image_url
FROM strains s
WHERE p.category = 'Flowers'
  AND LOWER(s.name) = LOWER(p.name)
  AND s.image_url IS NOT NULL AND s.image_url != '';
```

This runs **after** Step 1, so the URLs being copied are the new working Lovable Cloud URLs, not the dead WordPress ones.

### Step 3 — Keep them in sync going forward
Small change in `ProductCard.tsx` (it already accepts `strainData` as a prop): if the product is in Flowers and its `image_url` is empty, fall back to the matching strain's image automatically. So even if you add a new Flower product later without uploading an image, it'll pick up the strain photo if one exists.

## Files
| Action | File |
|---|---|
| New | `supabase/functions/migrate-strain-images/index.ts` |
| Modify | `src/components/admin/StrainsTab.tsx` (add "Migrate images" button) |
| Migration | UPDATE products SET image_url FROM strains (Flowers only) |
| Modify | `src/components/ProductCard.tsx` (fallback to strain image when product image is empty) |

## What you'll see after
All 10 Flowers cards will show real photos. The 8 strains with WordPress URLs will be re-hosted on your own backend (faster, no hotlink risk, won't break if the old WP site disappears). Maui Wowie and Watermelon get clean AI-generated bud photos.

## Note
This only fixes **Flowers**. The other categories (Edibles, Vapes, Concentrates, etc.) still have broken WordPress URLs and no matching strain entries. Once Lightspeed sorting/sync is figured out, those will get real product photos from there. In the meantime if you want, I can also generate placeholder category images for them — say the word.

