## Goal
Produce a clear report of the **30 CSV SKUs not found** in your `products` table from the WooCommerce export `wc-product-export-26-4-2026-1777197913596.csv`, so you can decide which to import as new products.

## What I'll do (one-shot script, no app changes)

1. **Read the CSV** (`user-uploads://wc-product-export-26-4-2026-1777197913596.csv`, 143 rows, BOM-prefixed).
2. **Read all SKUs from the database** via the Supabase query tool (already confirmed — ~440 SKUs returned).
3. **Compute the diff**: CSV SKUs not present in `products.sku`.
4. **For each missing SKU, capture from the CSV**:
   - SKU
   - Name
   - Category
   - Regular price
   - Stock status
   - First image URL (and total image count if multiple)
   - Whether the image URL field is empty

## Deliverables (written to `/mnt/documents/`)

- **`missing-skus-report.csv`** — sortable spreadsheet with the columns above
- **`missing-skus-report.md`** — human-readable summary grouped by category, plus headline counts:
  - Total missing
  - How many have an image URL vs none
  - Breakdown by category

I'll also paste a compact preview of the report directly in chat so you can scan it without downloading, and emit `<lov-artifact>` tags for both files.

## What I won't do
- No database writes
- No new products created (this is the decision step — you tell me which ones to import after reviewing)
- No code changes to the app

## After you review
Based on what you see, you can then ask me to either:
- **Bulk-import all 30** as new products (and pull images via the existing `import-csv-images` flow), or
- **Import a specific subset** you select, or
- **Skip them** entirely.