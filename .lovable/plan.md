## Enable drag-and-drop product images in the Admin Products tab

Right now images can only be added by clicking "Upload" inside the edit dialog. This adds drag-and-drop in two places, using the existing `product-images` Supabase storage bucket and `uploadImage` helper that's already in `ProductsTab.tsx`.

### 1. Drag onto a product row in the table

In the products table (`src/components/admin/ProductsTab.tsx`, the image cell around line 525–531), make each row a drop target.

- Drag any image file from your desktop onto a row → uploads to `product-images` bucket → updates that product's `image_url` in the DB → row thumbnail refreshes.
- While dragging over a row, the row gets a primary-coloured ring/border so you can see where it'll land.
- A small toast shows "Uploading…" then "Image updated for {product name}" (or an error toast on failure).
- Optimistic update: thumbnail switches to the new image immediately; reverts on error.

### 2. Drag into the Add/Edit dialog

The image area in the dialog (around line 569–593) becomes a dashed drop zone:

- Drag an image file anywhere onto the image preview / upload row → sets `imageFile` + `imagePreview` (same flow as the existing file picker).
- The existing "Upload" button and "Or paste image URL" field stay as-is.
- Visual: dashed border + "Drop image here" hint when a file is being dragged over the zone.

### 3. Bulk drag onto the table (nice bonus)

If you drag multiple files at once onto a row, only the first file is used for that row (keeps it predictable). A note in the empty-state area mentions: *"Tip: drag an image file onto any row to replace its photo."*

### Technical details

- Pure client-side: uses native HTML5 `onDragOver` / `onDragLeave` / `onDrop` handlers — no new dependencies.
- Reuses the existing `uploadImage(file, slug)` function (uploads to `product-images` bucket, returns public URL).
- After upload, calls `supabase.from("products").update({ image_url }).eq("id", p.id)` and updates local state.
- Validates: only accepts `image/*` MIME types; rejects others with a toast.
- File size guard: warn if > 5 MB (still allows upload, since the bucket has no hard cap configured).
- No DB schema changes. No new edge functions. No new bucket — `product-images` already exists and is used by the current upload flow.
- Adds a small `uploadingId` state so a row shows a spinner overlay while uploading.

### Files touched

- `src/components/admin/ProductsTab.tsx` — only file changed.

### Out of scope

- Reordering rows by drag (this is just images).
- Multi-image / gallery per product (schema only has one `image_url`).
- Drag-and-drop in the Strains tab — happy to add the same pattern there in a follow-up if you want.
