import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { name, category } = await req.json();
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Product name required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You write premium product descriptions for The Divine Collective, an upscale South African cannabis dispensary.

Voice: warm, editorial, confident — like a knowledgeable friend, never clinical or salesy.
Length: exactly 2–3 sentences (40–70 words total).
Content rules:
- Mention what the product is and the experience it offers.
- For Edibles: hint at flavour profile, format (gummy, chocolate, drink), and a sense of effect (relaxing, uplifting, social) — but no specific medical claims.
- For Vape Products / Concentrates: mention hardware quality, flavour, and convenience.
- For Accessories: focus on craftsmanship, material, and how it elevates the ritual.
- For Flowers / Preroll: highlight strain notes, terpenes, and the moment it suits.
- NEVER make medical claims (no "treats", "cures", "heals", "medicinal benefits").
- NEVER use the words: "best", "highest quality", "world-class".
- Use British / South African English spelling.
- Do not start with "Introducing" or "Discover".

Return ONLY the description text — no quotes, no markdown, no preamble.`;

    const userPrompt = `Product name: ${name.trim()}${category ? `\nCategory: ${category}` : ""}\n\nWrite the description.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const description = data?.choices?.[0]?.message?.content?.trim() || "";

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-product-description error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
