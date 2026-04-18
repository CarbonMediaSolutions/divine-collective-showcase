

# Add Pre-Roll Strains Section

## Goal
Let admin mark strains as available in pre-roll form, and surface a dedicated "Pre-Roll Strains" area on the public Strain Library page.

## Approach

### 1. Database
Add `is_preroll boolean DEFAULT false` to the `strains` table. No backfill needed — admin will toggle as needed.

### 2. Admin (`src/components/admin/StrainsTab.tsx`)
- Add a "Pre-Roll" toggle in the edit dialog (next to Visible / In Stock / Featured).
- Add an inline "Pre-Roll" switch column in the table for quick toggling (mirrors the Visible toggle pattern).
- Add a "PRE-ROLLS" chip to the visibility filter row so admin can quickly view only pre-roll strains.

### 3. Public Strain Library (`src/pages/StrainsPage.tsx`)
At the top of the page (above the existing search + ALL/INDICA/SATIVA/HYBRID filters), add a new **"Available as Pre-Rolls"** section:
- Horizontal scroll row (or 2-column grid on mobile, up to 4-column on desktop) of compact pre-roll strain cards.
- Each card: small image, name, category pill, and a "PRE-ROLL" badge.
- Clicking a card jumps to the strain detail page (same as main grid).
- Section only renders if at least one visible pre-roll strain exists.

The existing full strain grid stays unchanged below it. Optionally, add a "PRE-ROLL" filter chip to the existing filter row so users can filter the main grid too.

### 4. Strain detail page
Add a small "Available as Pre-Roll" badge near the THC pill when `is_preroll` is true (low effort, nice touch). Skip if you'd prefer minimal changes — let me know.

## Files
| Action | File |
|--------|------|
| Migration | Add `is_preroll boolean DEFAULT false` to `strains` |
| Modify | `src/components/admin/StrainsTab.tsx` |
| Modify | `src/pages/StrainsPage.tsx` |
| Modify | `src/pages/StrainDetailPage.tsx` (small badge) |

