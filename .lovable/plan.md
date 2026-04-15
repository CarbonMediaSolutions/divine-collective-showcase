

# Enrich Flower Products with Strain Data

## Overview
The 10 flower products in the static `products.ts` file have WooCommerce-era descriptions (raw HTML builder markup) and some have images. The strains database has clean, curated descriptions, images, THC ranges, feelings, and category data for all 10. We'll enrich the flower `ProductCard` and `ProductPage` by fetching matching strain data at runtime.

## Approach
Rather than duplicating strain data into the static file, we'll create a lightweight hook that fetches strain data for flower products and merges it at render time. This keeps the strains DB as the single source of truth.

## Changes

### 1. Create `src/hooks/useFlowerStrainData.ts`
- A React Query hook that fetches all strains matching the 10 flower product names from the `strains` table
- Returns a `Map<string, Strain>` keyed by lowercase product name for easy lookup
- Single query, cached globally

### 2. Modify `src/components/ProductCard.tsx`
- Accept an optional `strainData` prop with image_url and description
- When present, use strain `image_url` as the product image and show strain `category` badge (Indica/Sativa/Hybrid)
- Falls back to existing product data when no strain data provided

### 3. Modify `src/pages/CategoriesPage.tsx`
- Import the hook; when the active category is "Flowers" (or "All"), look up each flower product in the strain map
- Pass matched strain data to `ProductCard`

### 4. Modify `src/pages/ProductPage.tsx`
- For flower products, fetch the matching strain by name
- Replace the raw WooCommerce description with the clean strain description
- Show strain image, THC range, feelings pills, and category badge
- Add a "View in Strain Library" link to `/strains/{slug}`

### 5. Update `src/data/products.ts` (static cleanup)
- Clear the broken WooCommerce HTML from the `description` field of all 10 flower entries (set to empty string) so it doesn't flash before strain data loads

## Files
| Action | File |
|--------|------|
| Create | `src/hooks/useFlowerStrainData.ts` |
| Modify | `src/components/ProductCard.tsx` |
| Modify | `src/pages/CategoriesPage.tsx` |
| Modify | `src/pages/ProductPage.tsx` |
| Modify | `src/data/products.ts` |

