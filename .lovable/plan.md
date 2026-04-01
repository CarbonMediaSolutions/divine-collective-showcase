# Scrape Leafly Strain Images

## Approach

Write a script that fetches each Leafly strain page, extracts the primary strain image URL, and updates the `image_url` field in the `strains` table for all encyclopedia entries currently missing images.

## How It Works

1. Query the database for all strains where `image_url` is empty
2. For each strain, fetch the Leafly page at `https://www.leafly.com/strains/{slug}`
3. Extract the primary strain photo URL from the page markup (typically an `og:image` meta tag or hero image)
4. Update the strain's `image_url` in the database with the extracted URL

## Important Notes

- This hotlinks to Leafly's CDN — images load from their servers. If Leafly changes URLs or blocks hotlinking, images will break.
- Your 10 custom in-stock strains already have images and will not be touched. No override the current images for the strains pagebut not the shop page
- ~87 encyclopedia strains will be updated.
- The script runs once via `code--exec`.

## Files


| Action | File                                                   |
| ------ | ------------------------------------------------------ |
| Script | `/tmp/scrape-leafly-images.js` (temporary, runs once)  |
| DB     | UPDATE `strains` table `image_url` column for ~87 rows |
