

# Expand Emoji & Color Mappings in strainUtils.ts

## What
Extend all mapping objects in `src/lib/strainUtils.ts` to cover dozens more possible values that admins might enter, ensuring comprehensive future-proof coverage.

## Changes — `src/lib/strainUtils.ts` only

### `effectEmojis` — add ~20 more entries
Current: 11 entries. Add: Calm 🧘, Giggly 🤭, Aroused 💕, Motivated 💪, Inspired 💡, Meditative 🧘‍♂️, Sociable 🤝, Dreamy 💭, Blissful 😇, Painless 💆, Mellow 🌊, Balanced ⚖️, Alert 👁️, Nostalgic 🌅, Cerebral 🧠, Soothing 🫧, Spiritual 🕉️, Grounded 🌳, Confident 💎, Stimulated ⚡

### `flavourEmojis` — add ~30 more entries
Current: 24 entries. Add: Lemon 🍋, Lime 🍈, Mango 🥭, Peach 🍑, Strawberry 🍓, Cherry 🍒, Apple 🍏, Banana 🍌, Coconut 🥥, Lavender 💐, Rose 🌹, Mint 🌿, Menthol 🧊, Diesel ⛽, Fuel ⛽, Cheese 🧀, Nutty 🥜, Butter 🧈, Cream 🍦, Woody 🪵, Sage 🌿, Tea 🍵, Honey 🍯, Ginger 🫚, Pepper 🌶️, Cinnamon 🫙, Caramel 🍮, Ammonia 💨, Chemical 🧪, Musky 🫎, Dank 🌿, Skunk 🦨, Tobacco 🍂, Plum 🫐, Apricot 🍑, Bubblegum 🫧, Kush 🌿, Haze 🌫️, Tar 🖤

### `getFeelingColor` — add same new effect entries with appropriate colors
Group by vibe: calming → purple tones, energising → green tones, mood → gold tones, mental → teal tones, body → orange tones

### `getTerpeneColor` + `terpeneDescriptions` — add ~8 more terpenes
Add: Ocimene (basil, sweet), Bisabolol (chamomile, gentle), Valencene (citrus, fresh), Nerolidol (woody, floral), Guaiol (pine, woody), Camphene (herbal, sharp), Borneol (minty, cool), Eucalyptol (eucalyptus, minty)

## File
- `src/lib/strainUtils.ts` — single file update

