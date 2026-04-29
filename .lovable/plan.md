## Add quick category change in Admin → Products

The admin already lets you change a product's category from the Edit dialog. To make this faster, I'll add two improvements:

### 1. Inline category change in the products table
- Replace the read-only category Badge in each row with a small Select dropdown listing all categories (Edibles, Flowers, Accessories, Concentrates, Vape Products, Preroll, Membership).
- Changing it instantly updates the product in the database and refreshes the row.
- Shows a toast confirming the move (e.g. "Moved 'Maui Wowie' to Flowers").

### 2. Bulk category change
- Add a checkbox on each row plus a "Select all (filtered)" header checkbox.
- When 1+ rows are selected, a small action bar appears above the table:
  - "Change category to ▾ [Select]  Apply  ·  Clear selection"
- Confirms before applying ("Move 12 products to Edibles?"), then updates them all in one batch and refreshes.

This pairs well with the broken-images list — you can quickly recategorise mis-tagged products (e.g. some "Accessories" that are actually Edibles like Backwoods).

### Files to change
- `src/components/admin/ProductsTab.tsx` — add inline category Select, multi-select state, bulk action bar, and the update handlers (uses existing `supabase.from("products").update(...)`).

No DB schema changes; no new edge functions.
