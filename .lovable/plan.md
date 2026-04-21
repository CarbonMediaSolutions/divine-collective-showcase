

# Full Product Backend with AI-Assisted Descriptions

## Goal
Replace the static `src/data/products.ts` file with a database-backed product catalog. Admin gets a full CRUD interface (image upload, title, price, stock, description, category, sale price) plus a one-click AI button that auto-generates a product description from just the product name.

## What You'll Be Able to Do
- Add a new product from `/admin` → Products tab
- Upload a product photo (stored in Lovable Cloud, no more broken WordPress links)
- Edit name, price, sale price, category, SKU, stock status, visibility, featured flag
- Click **"Generate description with AI"** — fills the description field based on the product name + category
- Edit/delete existing products inline
- Toggle visibility/stock from the table (mirrors the Strains tab pattern)
- Public shop pages (`CategoriesPage`, `ProductPage`, cart) read live from the database

## Implementation

### 1. Database (migration)
New `products` table:
- `id`, `name`, `slug` (unique), `sku`, `category`, `price`, `sale_price` (nullable)
- `description` (text), `image_url` (text)
- `in_stock`, `visible`, `featured` (booleans, sensible defaults)
- `created_at`, `updated_at`

Public read RLS, public write (matches existing strains pattern — admin password gates access at the UI layer).

### 2. Storage
New public `product-images` Lovable Cloud storage bucket with public-read + public-write policies (mirrors `strain-images`).

### 3. Seed
One-off insert of all ~150 entries from `src/data/products.ts` into the new table so nothing disappears on launch. The broken WordPress image URLs come over as-is — you can replace each via the new admin upload UI as you go (or we batch-clear them to placeholders, your call).

### 4. AI description edge function
New `generate-product-description` edge function:
- Input: `{ name, category }`
- Calls Lovable AI Gateway (`google/gemini-3-flash-preview`)
- System prompt tuned for premium cannabis product copy: 2–3 sentences, warm editorial tone matching the brand voice, mentions category-appropriate details (effects for edibles, hardware for vapes, etc.), no medical claims, SA-market appropriate
- Returns `{ description }`

### 5. Admin UI (`src/components/admin/ProductsTab.tsx` — full rewrite)
Replaces the current read-only table. Includes:
- **Search + category filter** row
- **"+ Add Product"** button → opens edit dialog with empty fields
- **Table** with inline switches for Visible / In Stock / Featured (like StrainsTab)
- **Edit dialog** per product with:
  - Image upload (drop zone → uploads to `product-images` bucket → stores public URL)
  - Name, SKU, Category (dropdown), Price, Sale Price, Stock toggle
  - Description textarea with **"✨ Generate with AI"** button above it
  - Save / Delete buttons

### 6. Public shop refactor
- `src/data/products.ts` → keep the file as a thin re-export of a typed `Product` interface only (no data), OR delete entirely
- New `src/hooks/useProducts.ts` to fetch from the `products` table (with category filter)
- Update `CategoriesPage.tsx`, `ProductPage.tsx`, `CartContext.tsx` to read from the DB
- Cart context already stores product snapshots, so existing carts keep working

### 7. Admin dashboard wiring
The Products tab in `src/pages/AdminPage.tsx` swaps from the current static `ProductsTab` to the new DB-backed one.

## Files
| Action | File |
|--------|------|
| Migration | New `products` table + RLS + `product-images` storage bucket + policies |
| Seed | One-off insert of existing products from `src/data/products.ts` |
| New | `supabase/functions/generate-product-description/index.ts` |
| New | `src/components/admin/ProductsTab.tsx` (full CRUD with AI button) |
| New | `src/hooks/useProducts.ts` |
| Modify | `src/pages/AdminPage.tsx` (use new ProductsTab) |
| Modify | `src/pages/CategoriesPage.tsx`, `src/pages/ProductPage.tsx`, `src/contexts/CartContext.tsx` (read from DB) |
| Slim down | `src/data/products.ts` (keep only the `Product` type, or delete) |

## Notes
- Lovable AI is already wired up (`LOVABLE_API_KEY` is in your secrets), so the AI button works out of the box with no extra setup from you
- The Lightspeed sync conversation from earlier is still on the table — this admin backend would happily coexist with a future Lightspeed sync (the sync would just upsert into the same `products` table)
- Broken WordPress images will keep showing as broken in the public shop until you re-upload via the new admin — want me to swap them all to a clean placeholder during the migration so the shop looks polished immediately? Say the word and I'll add that to step 3.

