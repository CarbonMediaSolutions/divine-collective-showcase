

# Scrape Top 100 Leafly Strains and Add to Database

## Approach

I'll write a script that fetches the top 100 Leafly strain detail pages, parses the data, and generates a SQL migration to insert them into your existing `strains` table.

## How It Works

1. **Fetch the strain list** from Leafly's strains page (paginated) to get the top 100 strain slugs, names, and categories
2. **Fetch each detail page** to extract: description, THC/CBD%, effects, flavors, terpenes, and parent genetics
3. **Parse the markdown** output from each page to extract structured fields
4. **Generate a SQL migration** with INSERT ... ON CONFLICT (slug) DO UPDATE to upsert all 100 strains without duplicating the 10 you already have
5. **Run the migration** against your database

## Data Extracted Per Strain

| Field | Source on Leafly Page |
|-------|----------------------|
| name, slug, category | Heading + category link |
| thc_min, thc_max | THC percentage (use as both min/max since Leafly shows single %) |
| cbd_min, cbd_max | CBD percentage |
| effects | "Positive Effects" section (top 3-5) |
| feelings | Same as top 3 effects |
| flavours | "Top flavors" section |
| terpenes | "Terpenes" section |
| description | Main paragraph |
| parents | Parsed from description if mentioned |
| in_stock | Default false (these aren't your stock — just encyclopedia entries) |
| featured | Default false |
| grow_difficulty | Default 'Intermediate' |
| image_url | Empty (Leafly images are copyrighted) |

## Technical Details

- Script runs via `code--exec` using Node.js/fetch to scrape pages
- Rate-limited to avoid being blocked (small delay between requests)
- Output: a single SQL migration file with 100 upsert statements
- Existing 10 strains won't be overwritten (ON CONFLICT DO NOTHING or selective UPDATE)
- No images copied from Leafly (copyright) — strains will use placeholder images

## Important Notes

- **No Leafly images**: We won't copy their photos. Strains will show without images unless you upload your own later.
- **in_stock = false**: All scraped strains default to out-of-stock since they're encyclopedia entries, not your current inventory. Your existing 10 strains remain in-stock.
- **~3 minutes to run**: Fetching 100 pages sequentially with polite delays takes a few minutes.

## Files

| Action | File |
|--------|------|
| Script | `/tmp/scrape-leafly.js` (temporary, runs once) |
| Migration | `supabase/migrations/...leafly_strains_seed.sql` |

