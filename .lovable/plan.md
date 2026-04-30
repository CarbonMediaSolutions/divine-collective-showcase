## Import Zootley supplier images for all Zootley products

I've already scraped the supplier site (`zootlywholesale.co.za/product-category/cbd-edibles/`) and found 11 distinct supplier images. The supplier doesn't carry separate photos for the 35mg/60mg/100mg fudge variants — they share one fudge photo. Same for chocolate.

### Mapping (all 14 Zootley products)

| Product | Supplier image |
|---|---|
| Zootly Bon Bon - Cherry Kush | Bon-Bons_Cherry-Kush.jpg |
| Zootly Bon Bon - Strawberry and Cream | Bon-Bons_Strawberries-and-Cream.jpg |
| Zootly Bon Bon - Tuttie Fruity | Bon-Bons_Tutti-Fruity.jpg |
| Zootley Jellie Jar - Sour Apple | CBD-Jellies_OPEN_Sour-Apple.jpg |
| Zootley Jellie Jar - Tropical Fruit | CBD-Jellies_OPEN_Tropical-Fruit.jpg |
| Zootley Jellie Jar - Tuttie Fruity | CBD-Jellies_OPEN_Tutti-Fruity.jpg |
| Zootly Jellies - Sour Apple (20mg) | Jellies-Sachet_Sour-Apple.jpg |
| Zootly Jellies - Tuttie Fruity (10mg) | Jellies-Sachet_Tutti-Fruity-1.jpg |
| Zootly Jellies - Tropical Fruit (40mg) | CBD-Jellies_OPEN_Tropical-Fruit.jpg (no sachet variant) |
| Zootly Jellies (generic) | Jellies-Sachet_Tutti-Fruity-1.jpg |
| Zootley Vanilla Fudge - 35mg / 60mg / 100mg | Edibles_open-container_Fudge-v2.jpg (shared) |
| Zootly Belgian Chocolate | Jolly-Choc.webp |

### Steps
1. Create a one-off edge function `import-zootly-images` that downloads each supplier image, uploads it to the `product-images` bucket under `zootly/`, and updates the matching product's `image_url`.
2. Deploy and invoke it once.
3. Delete the function after it runs (it's a one-shot).
4. Report back with the list of 14 updated products and their new URLs.

### File changes
- Add (then remove) `supabase/functions/import-zootly-images/index.ts`. No frontend code touched.
