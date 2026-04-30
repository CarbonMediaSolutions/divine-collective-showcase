## Match uploaded images to products

Final mapping confirmed by you:

| Uploaded file | Matched product | Category |
|---|---|---|
| `45964.jpg` | OCB Plant Grinder | Accessories |
| `411280022_5-2048x1800.webp` | Gizeh - King Size Slim Unbleached + Tips | Accessories |
| `IMG_0725-1152x1536.jpg` (Oreo Brownie) | **Jane's Brownie Bites** | Edibles |
| `IMG_0727-1152x1536.jpg` | Jane's Fudge Cookie Crunch | Edibles |
| `IMG_0728-1152x1536.jpg` | Jane's Death by Chocolate Cups | Edibles |
| `IMG_0730-1152x1536.jpg` | Janes Vegan Peanutbutter Cookies | Edibles |
| `IMG_0731-1152x1536.jpg` | Jane's Vegan Biscoff Brownie Bite | Edibles |
| `IMG_0731-1-1152x1536.jpg` | (skip — duplicate of Biscoff) | — |

### Steps
1. Copy each upload from `user-uploads://` to `/tmp/`.
2. Upload to the `product-images` Supabase storage bucket at `manual/{slug}.{ext}` using the service role key (via a one-off script).
3. Update `products.image_url` for each of the 7 matched products to the new public URL via a migration.
4. Confirm with a list of updated products and their new image URLs.

No source files modified — data + storage only.
