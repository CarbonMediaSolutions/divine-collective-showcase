## Master button: AI-generate descriptions for visible products

Add a single button in Admin → Products that bulk-generates AI descriptions for all currently visible products that are missing one (or have a very short one).

### How it works
- New button "AI: Generate descriptions" sits next to the existing "Import images from CSV" / "Add Product" buttons.
- When clicked it picks all products in the current filtered list that:
  - have `visible = true`, AND
  - have an empty description OR a description shorter than 20 characters.
- Shows a confirm dialog with the count: *"Generate AI descriptions for 47 visible product(s)?"*
- Loops through them one at a time, calling the existing `generate-product-description` edge function (already deployed and tuned for the Divine Collective brand voice).
- Saves each result to the database as it completes and updates the row inline.
- Shows live progress on the button: *"Generating 12 / 47…"*
- Throttles ~600ms between calls to avoid rate limits, and surfaces failures in a final toast: *"Generated 45 description(s), 2 failed"*.

### Scope rules
- Operates on the **current filter** (so you can narrow to e.g. category = Edibles and run it on just those).
- Skips products that already have a real description (won't overwrite existing copy).
- No schema or edge-function changes — reuses the existing `generate-product-description` function.

### File changes
- `src/components/admin/ProductsTab.tsx` — add bulk-generate state, handler, and the button.
