## Import Puffco product images

Bring in product photography from puffco.com for these 9 products (replacing the current Divine Lighting Test shoot images on each):

| # | Product (in our DB) | Puffco source page | Variant |
|---|---|---|---|
| 1 | Puffco - Ryan Fitt Recycler Glass 2.0 | `/products/ryan-fitt-recycler-glass-2-0` | default |
| 2 | Puffco - Peak Pro Travel Glass | `/products/puffco-travel-glass` | clear |
| 3 | Puffco - Proxy Wizard (Black) | `/products/proxy-wizard` | Onyx |
| 4 | Puffco - Proxy Wizard (Desert) | `/products/proxy-wizard-haze` | Haze |
| 5 | Puffco - Proxy Travel Bag (Black) | `/products/proxybag` | Onyx |
| 6 | Puffco - Proxy Travel Bag (Desert) | `/products/colorbags` | Desert |
| 7 | Puffco - Proxy Kit (Black) | `/products/proxy-kit` | Onyx |
| 8 | Puffco - Proxy Kit (Bloom) | `/products/proxy-kit` | Bloom variant |
| 9 | Puffco - Proxy Kit (Desert) | `/products/proxy-kit-haze` | Haze (desert-toned) |
| 10 | Puffco - Proxy Ripple Sage | `/products/proxy-pipe` | Ripple Sage variant |
| 11 | Puffco - Hot Knife (Bloom / Dessert / Flourish) | `/products/the-puffco-hot-knife` | V2 Onyx (old colour variants discontinued by Puffco — will use closest available) |

### Approach

1. Scrape each Puffco product page above and pick the cleanest hero/front-facing image (preferring "front" or "3quarters" angles on a transparent/white background).
2. Download all selected images to a temp folder.
3. Upload them to the existing `product-images` Supabase storage bucket under a `puffco/` prefix (e.g. `puffco/proxy-wizard-onyx.png`).
4. Update each product row's `image_url` in the `products` table to the new public storage URL.
5. Clean up temp files.

### Caveats

- **Hot Knife colour variants (Bloom / Dessert / Flourish / Paradise Blue / Pearl)** are no longer sold by Puffco — only the V2 Onyx exists on their site. I'll use the V2 image for all three visible Hot Knife products (it won't reflect the original colour). If you'd rather keep your existing Divine photos for these, say so.
- **Proxy Wizard (Desert)** — Puffco sells a "Haze" colourway which is the closest match to desert; will use that.
- **Proxy Ripple Sage** — sourced from the Proxy Pipe page's Ripple Sage variant.
- All current Divine Lighting Test shoot images will be replaced. They'll remain in storage if you ever want to revert.
