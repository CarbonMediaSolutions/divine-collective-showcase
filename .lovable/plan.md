## Refresh Preroll category — hide old, add 14 new @ R110

### What changes

**Hide** (don't delete) the 5 current Preroll products by setting `visible = false`:
- Moneyball, Daily Slap, Firewalker OG, Platinum OG, Pre-roll

**Insert** 14 new Preroll products, one per strain in your screenshot. Each reuses the matching strain's image and description so the listing matches the reference layout.

| Product | Strain category |
|---|---|
| Apple Fritter Pre-Roll | Hybrid |
| Biblica Pre-Roll | Hybrid |
| Blue Runtz Pre-Roll | Hybrid |
| Cherry Pie Pre-Roll | Hybrid |
| Gelato Pre-Roll | Hybrid |
| Lemon Cherry Gelato Pre-Roll | Hybrid |
| Pineapple Punch Pre-Roll | Sativa |
| Platinum Kush Breath Pre-Roll | Indica |
| Purple Chem Pre-Roll | Indica |
| Purple Thai Pre-Roll | Sativa |
| Strawberry Haze Pre-Roll | Sativa |
| Tangie Pre-Roll | Sativa |
| WiFi Pre-Roll | Hybrid |
| Zombie OG Pre-Roll | Indica |

### Fields applied to each new product

- `category`: `Preroll`
- `price`: `110.00`, `sale_price`: `null`
- `in_stock`: `true`, `visible`: `true`, `featured`: `false`
- `name`: `"<Strain> Pre-Roll"`
- `slug`: `"<strain-slug>-pre-roll"`
- `subcategory`: strain category (Hybrid / Sativa / Indica) — drives the colored chip on cards
- `image_url` + `description`: copied at insert time from the matching `strains` row

### Technical details

- Single SQL operation: `UPDATE products SET visible = false WHERE category = 'Preroll';` then 14 `INSERT … SELECT` statements pulling `image_url` and `description` from `strains` by slug.
- No schema changes, no code changes — `useProducts`, `ProductCard`, and the categories page already filter by `visible = true` and group by `category`.
- Old products remain in the DB so they can be re-enabled later from the Admin Products tab.

### Out of scope

- Deleting the old products (kept hidden as requested).
- Adding a "PRE-ROLL" badge ribbon on cards (not part of `ProductCard` today — happy to add as a follow-up).
