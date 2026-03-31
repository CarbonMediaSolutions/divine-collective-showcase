

# Strains Encyclopedia — Leafly-Style Design + Database

## Overview
Build a full cannabis strain encyclopedia with a Supabase-backed `strains` table, a filterable library page at `/strains`, and rich detail pages at `/strains/:slug` — all styled in Leafly's editorial layout adapted to the brand's dark green on cream aesthetic.

## Database Changes

### Migration: Create `strains` table
```sql
CREATE TABLE public.strains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Hybrid',
  thc_min numeric DEFAULT 0,
  thc_max numeric DEFAULT 0,
  cbd_min numeric DEFAULT 0,
  cbd_max numeric DEFAULT 0,
  parents text,
  flavours text[] DEFAULT '{}',
  effects text[] DEFAULT '{}',
  feelings text[] DEFAULT '{}',
  terpenes text[] DEFAULT '{}',
  description text DEFAULT '',
  grow_info text DEFAULT '',
  grow_difficulty text DEFAULT 'Intermediate',
  image_url text DEFAULT '',
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.strains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read strains"
ON public.strains FOR SELECT TO public
USING (true);
```

### Seed: Insert all 10 strains via INSERT tool
All 10 strains (Alien Cookies, Mimosa, Jungle Diamonds, Blue Walker, Sugar Cane, Violet Bag, Elvis, Watermelon, Maui Wowie, Panama Punch) will be inserted with full data as specified — descriptions, terpenes, effects, feelings, flavours, parents, grow info, THC/CBD ranges.

## New Files

### `src/lib/strainUtils.ts`
Helper functions used across strain pages:
- `getCategoryColors(category)` — returns `{ bg, text, light }` for Indica/Sativa/Hybrid
- `getFeelingColor(feeling)` — returns pill colors by feeling type
- `getTerpeneColor(terpene)` — returns dot color by terpene name
- Terpene descriptions map
- Effect emoji map
- Flavour emoji map

### `src/pages/StrainsPage.tsx` — Library `/strains`
- Hero: dark green banner with "Strain Library" heading
- Filter pills: ALL | INDICA | SATIVA | HYBRID | FEATURED | IN STOCK
- Search input for strain name
- Grid of strain cards (Leafly-style):
  - Image placeholder (220px) with category badge top-right
  - Name in bold serif green
  - Top 3 feelings as colored pills
  - THC range pill
  - 2-line truncated description
  - "EXPLORE STRAIN →" link
- Bottom disclaimer text
- Data fetched from Supabase `strains` table

### `src/pages/StrainDetailPage.tsx` — Detail `/strains/:slug`
Sections in order:

1. **Hero** (2-column): Left — large image (450px) + category badge + stock badge. Right — H1 name (Playfair Display 48px), tagline, star rating, genetics line, feelings pills, THC/CBD progress bars with "Cannabinoids" heading

2. **Description** — full paragraph, 16px, line-height 1.8

3. **Strain Effects** — icon grid with emoji mappings, 3-5 effects

4. **"Is this your strain?"** — side card with light green bg, checkmark list of feelings, "FIND SIMILAR STRAINS" button linking to `/strains?category=X`

5. **Strain Flavors** — icon grid with emoji mappings

6. **Terpene Profile** — colored dot + name + description rows

7. **Similar Strains** — 3 cards from same category, horizontal scroll on mobile

8. **Share This Strain** — dashed border card with QR code (qrcode.react), download button

9. **Grow Information** — 2-column grid of grow stats (if grow_info exists)

## Modified Files

### `src/App.tsx`
- Import `StrainsPage` and `StrainDetailPage`
- Add routes: `/strains` and `/strains/:slug`

### `src/components/Header.tsx`
- Add "STRAINS" nav link between "SHOP" and "LOUNGE"

## Technical Details
- Font: Playfair Display imported via Google Fonts link in `index.html`
- THC bar width: `((thc_min + thc_max) / 2) / 35 * 100`%
- All data from Supabase with `@tanstack/react-query` for caching
- Category colors, terpene colors, effect emojis all centralized in `strainUtils.ts`
- Mobile responsive: hero stacks vertically, effect/flavour grids 2-col, similar strains horizontal scroll

## Files Summary

| Action | File |
|--------|------|
| Migration | Create `strains` table with RLS |
| Seed | Insert 10 strains via INSERT |
| Create | `src/lib/strainUtils.ts` |
| Create | `src/pages/StrainsPage.tsx` |
| Create | `src/pages/StrainDetailPage.tsx` |
| Modify | `src/App.tsx` — add routes |
| Modify | `src/components/Header.tsx` — add nav link |
| Modify | `index.html` — add Playfair Display font |

