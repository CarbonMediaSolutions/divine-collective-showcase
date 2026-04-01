import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name } = await req.json();
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return new Response(JSON.stringify({ error: "Name must be at least 2 characters" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = `You are a cannabis strain encyclopedia expert with deep knowledge of strains from Leafly, Weedmaps, and other databases. Given a strain name, return accurate, detailed data about that strain.

For feelings, effects, flavours, and terpenes, prefer these mapped values when applicable:

Feelings/Effects: Relaxed, Happy, Euphoric, Uplifted, Sleepy, Creative, Hungry, Talkative, Energetic, Focused, Tingly, Calm, Giggly, Aroused, Motivated, Inspired, Sociable, Dreamy, Blissful, Mellow, Balanced, Alert, Cerebral, Soothing, Spiritual, Grounded, Confident, Stimulated

Flavours: Earthy, Sweet, Citrus, Berry, Pine, Woody, Spicy, Herbal, Tropical, Floral, Grape, Diesel, Pungent, Sour, Mint, Lemon, Lime, Mango, Peach, Strawberry, Cherry, Apple, Banana, Coconut, Lavender, Rose, Menthol, Cheese, Nutty, Butter, Cream, Sage, Tea, Honey, Ginger, Pepper, Cinnamon, Caramel, Skunk, Haze, Blueberry, Coffee, Chocolate, Vanilla, Ammonia

Terpenes: Myrcene, Limonene, Caryophyllene, Linalool, Pinene, Humulene, Terpinolene, Ocimene, Bisabolol, Valencene, Nerolidol, Guaiol, Camphene, Borneol, Eucalyptol

Write a 2-3 sentence description in an editorial, informative tone. For grow_info, provide 1-2 sentences about growing characteristics.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate complete strain data for: "${name.trim()}"` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "strain_data",
            description: "Return structured cannabis strain data",
            parameters: {
              type: "object",
              properties: {
                category: { type: "string", enum: ["Indica", "Sativa", "Hybrid"] },
                thc_min: { type: "number" },
                thc_max: { type: "number" },
                cbd_min: { type: "number" },
                cbd_max: { type: "number" },
                description: { type: "string" },
                feelings: { type: "array", items: { type: "string" } },
                effects: { type: "array", items: { type: "string" } },
                flavours: { type: "array", items: { type: "string" } },
                terpenes: { type: "array", items: { type: "string" } },
                parents: { type: "string" },
                grow_difficulty: { type: "string", enum: ["Easy", "Intermediate", "Difficult"] },
                grow_info: { type: "string" },
              },
              required: ["category", "thc_min", "thc_max", "cbd_min", "cbd_max", "description", "feelings", "effects", "flavours", "terpenes", "parents", "grow_difficulty", "grow_info"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "strain_data" } },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No structured data returned");

    const strainData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(strainData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-strain-data error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
