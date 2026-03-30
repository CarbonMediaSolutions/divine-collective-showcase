

# Remove White Polaroid Frames from Gallery

## Change
Remove the white background/padding from the polaroid card wrapper so images display directly with just the tape decorations and rotation.

### `src/pages/LoungePage.tsx` (line 85)
- Remove `bg-white p-2.5 pb-6` from the wrapper div
- Keep the rotation, tape strips, hover effect, and shadow
- Adjust bottom tape position since padding is removed

Specifically:
- Change `className="bg-white p-2.5 pb-6 relative ..."` → `className="relative ..."`
- Remove `boxShadow`
- Adjust bottom tape `bottom: 16` → `bottom: -8` (so it still sits near the bottom edge)

