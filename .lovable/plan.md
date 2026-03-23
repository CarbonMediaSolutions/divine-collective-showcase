

## Plan: Build Shop & Product Pages from CSV Data

### Overview
Parse the WooCommerce CSV export, create a static product data file, rebuild the Categories/Shop page with real products, and add individual product detail pages. Match the existing site design (reference screenshot shows breadcrumb, 4-col grid, sort dropdown, product cards with images and prices).

### Data Extraction Strategy
From the CSV (~502 rows), extract only published products (Published=1) with these fields:
- **id**, **name**, **price** (Regular price column), **salePrice** (Sale price), **category** (parsed from hierarchical Categories field like "Edibles > Gummies"), **image** (first URL from Images column), **description** (clean HTML from Short description or Description), **inStock**, **sku**

Normalize categories into: **Edibles**, **Flowers**, **Accessories**, **Vape Products**, **Preroll**, **Drinks**, **Uncategorized** (and subcategories for filtering).

Products with Published=-1 will be excluded. Products with no category or "Uncategorized" will be assigned to a general category.

### Files to Create/Modify

1. **`src/data/products.ts`** — Static typed product array exported from parsed CSV data. Each product has: `id, slug, name, price, salePrice, category, subcategory, image, description, inStock, sku`. Slugs generated from names for URL routing.

2. **`src/pages/CategoriesPage.tsx`** (rewrite) — Shop landing page matching reference screenshot:
   - Breadcrumb: Home / Shop
   - Category filter buttons (All, Edibles, Flowers, Accessories, Vape Products, Preroll)
   - "Showing X of Y results" count + "Sort by" dropdown (latest, price low-high, price high-low, name A-Z)
   - 4-col product grid (responsive: 2-col tablet, 1-col mobile)
   - Each card: product image (from URL or placeholder), name, price (R format), link to product page
   - Pagination (16 products per page)

3. **`src/pages/CategoryPage.tsx`** (new) — Filtered view for a single category (route: `/categories/:category`), same layout as shop but pre-filtered.

4. **`src/pages/ProductPage.tsx`** (new) — Individual product detail page (route: `/product/:slug`):
   - Breadcrumb: Home / Category / Product Name
   - Two-column layout: large product image left, details right
   - Product name (serif heading), price, description, stock status
   - "Add to Cart" style button (non-functional, frontend showcase)
   - Related products section (same category, 3-4 items)

5. **`src/App.tsx`** — Add new routes: `/categories/:category`, `/product/:slug`

6. **`src/components/ProductCard.tsx`** (new) — Reusable card component used in shop grid, best sellers, and related products.

7. **`src/pages/HomePage.tsx`** — Update Best Sellers section to pull from real product data.

### Technical Details

- Product images use external URLs from thedivinecollective.co.za (hotlinked). Fallback to placeholder div if no image URL.
- HTML in descriptions will be stripped to plain text for the data file, or rendered safely.
- Category hierarchy parsing: "Edibles > Gummies" becomes category="Edibles", subcategory="Gummies".
- URL slugs: kebab-case from product name + id suffix for uniqueness.
- No backend needed — all data is static in a TypeScript file.

### Estimated Scope
- ~7 files created/modified
- ~300-400 published products in the data file

