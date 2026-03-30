

# Refine Lounge Page — Spacing, Proportions, Visual Rhythm

## Changes to `src/pages/LoungePage.tsx`

### Hero Section
- Reduce padding from `py-16 md:py-24` → `py-10 md:py-14`
- Remove `minHeight: 220`
- Tighten heading margin from `mb-6` → `mb-3`
- Reduce paragraph max-width from `700px` → `580px`, font size to `text-[15px]`
- Reduce background circle opacity from `opacity-10` → `opacity-[0.04]`

### Video Section
- Reduce height from `60vh` → `50vh`, minHeight from 350 → 280

### "Why Become A Member" Strip
- Replace `section-padding` with `py-10 md:py-12`
- Reduce heading from `text-[28px] md:text-[36px]` → `text-[24px] md:text-[30px]`, margin `mb-3` → `mb-1`
- Reduce paragraph to `text-sm`
- Shrink button: `px-8 py-3` → `px-6 py-2.5`, `text-xs`

### Polaroid Gallery
- Replace `section-padding` with `py-12 md:py-16`
- Reduce gap from `gap-x-10 gap-y-14` → `gap-x-6 gap-y-10`
- Shrink polaroids from `w-[260px] md:w-[280px]` → `w-[230px] md:w-[250px]`
- Image height from `h-[280px] md:h-[320px]` → `h-[240px] md:h-[270px]`
- Vary rotations more naturally: `[-2.5, 1.8, -1, 3, -1.8, 2.2]`
- Vary tape positions per card with unique top/right/angle offsets per index using small arrays
- Reduce padding from `p-3 pb-8` → `p-2.5 pb-6`

### Events Banner
- Replace `section-padding` with `py-10 md:py-12`
- Reduce heading to `text-[24px] md:text-[30px]`, margin `mb-3` → `mb-1`
- Reduce paragraph to `text-sm`
- Shrink button: `px-6 py-2.5 text-xs`

## Changes to `src/components/Footer.tsx`

- Replace `section-padding` with `py-12 md:py-14`
- Reduce grid gap from `gap-12` → `gap-8`
- Shrink logo from `text-[36px]` → `text-[28px]`
- Reduce description line-height, keep `text-sm`
- Tighten sitemap list spacing from `space-y-3` → `space-y-2`
- Reduce section label margin from `mb-6` → `mb-4`
- Tighten info items spacing from `space-y-4` → `space-y-3`
- Social icons: `w-10 h-10` → `w-8 h-8`, icon size 18 → 15

## Files Modified
- `src/pages/LoungePage.tsx`
- `src/components/Footer.tsx`

