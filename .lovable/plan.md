

# AI Auto-Fill Strain Data from Name

## Overview
Add an "Auto-fill with AI" button to the strain add/edit dialog. When clicked, it sends the strain name to an edge function that calls Lovable AI (Gemini) to generate Leafly-style strain data, then populates all form fields.

## Changes

### 1. Edge Function: `supabase/functions/generate-strain-data/index.ts`
- Accepts `{ name: string }` in the request body
- Calls Lovable AI Gateway with a detailed system prompt instructing it to return cannabis strain data matching Leafly's style
- Uses tool calling (structured output) to return a strict JSON schema with: category, thc_min, thc_max, cbd_min, cbd_max, description, feelings, effects, flavours, terpenes, parents, grow_difficulty, grow_info
- Returns the parsed JSON to the client

### 2. UI: `src/components/admin/StrainsTab.tsx`
- Add a "Auto-fill" button (with a sparkle/wand icon) next to the Name input field
- Button is enabled when name has 2+ characters
- On click: shows loading state, calls the edge function via `supabase.functions.invoke('generate-strain-data', { body: { name } })`
- On success: populates all form fields with the returned data (preserving any existing image)
- On error: shows toast with error message

## Technical Details

**Structured output schema** for the AI call:
```json
{
  "name": "strain_data",
  "parameters": {
    "properties": {
      "category": { "type": "string", "enum": ["Indica", "Sativa", "Hybrid"] },
      "thc_min": { "type": "number" },
      "thc_max": { "type": "number" },
      "cbd_min": { "type": "number" },
      "cbd_max": { "type": "number" },
      "description": { "type": "string" },
      "feelings": { "type": "array", "items": { "type": "string" } },
      "effects": { "type": "array", "items": { "type": "string" } },
      "flavours": { "type": "array", "items": { "type": "string" } },
      "terpenes": { "type": "array", "items": { "type": "string" } },
      "parents": { "type": "string" },
      "grow_difficulty": { "type": "string", "enum": ["Easy", "Intermediate", "Difficult"] },
      "grow_info": { "type": "string" }
    }
  }
}
```

**System prompt** will instruct the AI to act as a cannabis strain encyclopedia expert, returning accurate data based on well-known strain databases like Leafly, using the mapped values from `strainUtils.ts` for feelings, effects, flavours, and terpenes where possible.

## Files

| Action | File |
|--------|------|
| Create | `supabase/functions/generate-strain-data/index.ts` |
| Modify | `src/components/admin/StrainsTab.tsx` — add auto-fill button + logic |

