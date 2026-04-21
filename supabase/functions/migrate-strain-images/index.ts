import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const BUCKET = "strain-images";

interface StrainRow {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

const isExternalUrl = (url: string | null) => {
  if (!url) return false;
  if (url.includes("supabase.co/storage")) return false;
  return /^https?:\/\//i.test(url);
};

const isHosted = (url: string | null) =>
  !!url && url.includes("supabase.co/storage");

const guessExt = (contentType: string | null, url: string) => {
  const ct = (contentType || "").toLowerCase();
  if (ct.includes("png")) return "png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("avif")) return "avif";
  const m = url.match(/\.(png|jpe?g|webp|avif)(\?|$)/i);
  if (m) return m[1].toLowerCase().replace("jpeg", "jpg");
  return "jpg";
};

async function uploadBytes(
  supabase: ReturnType<typeof createClient>,
  slug: string,
  bytes: Uint8Array,
  ext: string,
  contentType: string,
) {
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Upload failed for ${slug}: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function migrateExternal(
  supabase: ReturnType<typeof createClient>,
  strain: StrainRow,
) {
  const res = await fetch(strain.image_url!, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; DivineCollectiveBot/1.0; +https://thedivinecollective.co.za)",
      Accept: "image/*,*/*",
    },
  });
  if (!res.ok) throw new Error(`Fetch ${res.status} for ${strain.name}`);
  const ct = res.headers.get("content-type") || "image/jpeg";
  const buf = new Uint8Array(await res.arrayBuffer());
  const ext = guessExt(ct, strain.image_url!);
  return uploadBytes(supabase, strain.slug, buf, ext, ct);
}

async function generateAndUpload(
  supabase: ReturnType<typeof createClient>,
  strain: StrainRow,
) {
  const prompt =
    `Premium close-up macro photograph of a single ${strain.name} cannabis flower bud. Dense trichome-covered nug, vibrant natural colors, soft studio lighting, clean neutral background, professional cannabis dispensary product photography, high detail, no text, no watermark.`;

  const aiRes = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    },
  );

  if (!aiRes.ok) {
    const t = await aiRes.text();
    throw new Error(`AI gen ${aiRes.status}: ${t.slice(0, 200)}`);
  }

  const data = await aiRes.json();
  const dataUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!dataUrl || !dataUrl.startsWith("data:")) {
    throw new Error(`No image returned for ${strain.name}`);
  }
  const [meta, b64] = dataUrl.split(",");
  const ct = meta.match(/data:([^;]+)/)?.[1] || "image/png";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const ext = guessExt(ct, "");
  return uploadBytes(supabase, strain.slug, bytes, ext, ct);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Optional: { names: string[] } to scope the run; default = all strains needing work
    let scope: string[] | null = null;
    try {
      if (req.method === "POST") {
        const body = await req.json().catch(() => null);
        if (body?.names && Array.isArray(body.names)) scope = body.names;
      }
    } catch {
      /* ignore */
    }

    let q = supabase.from("strains").select("id, name, slug, image_url");
    if (scope) q = q.in("name", scope);
    const { data: strains, error } = await q;
    if (error) throw error;

    const results: Array<{
      name: string;
      action: "rehosted" | "generated" | "skipped" | "failed";
      url?: string;
      error?: string;
    }> = [];

    for (const s of (strains || []) as StrainRow[]) {
      try {
        if (isHosted(s.image_url)) {
          results.push({
            name: s.name,
            action: "skipped",
            url: s.image_url!,
          });
          continue;
        }

        let newUrl: string;
        if (isExternalUrl(s.image_url)) {
          try {
            newUrl = await migrateExternal(supabase, s);
            const { error: upErr } = await supabase
              .from("strains")
              .update({ image_url: newUrl })
              .eq("id", s.id);
            if (upErr) throw upErr;
            results.push({ name: s.name, action: "rehosted", url: newUrl });
            continue;
          } catch (e) {
            // Source dead → fall through to AI generation
            console.log(
              `Re-host failed for ${s.name}, generating: ${(e as Error).message}`,
            );
          }
        }

        // No image OR external fetch failed → AI generate
        newUrl = await generateAndUpload(supabase, s);
        const { error: upErr } = await supabase
          .from("strains")
          .update({ image_url: newUrl })
          .eq("id", s.id);
        if (upErr) throw upErr;
        results.push({ name: s.name, action: "generated", url: newUrl });
      } catch (e) {
        results.push({
          name: s.name,
          action: "failed",
          error: (e as Error).message,
        });
      }
    }

    // Sync Flowers products to their strain image
    const { error: syncErr } = await supabase.rpc("exec", {}).catch(() => ({
      error: null,
    }));
    // RPC not available; do per-row update via JS
    const { data: flowerProducts } = await supabase
      .from("products")
      .select("id, name")
      .eq("category", "Flowers");

    let productsUpdated = 0;
    if (flowerProducts) {
      const { data: allStrains } = await supabase
        .from("strains")
        .select("name, image_url");
      const strainMap = new Map<string, string>();
      (allStrains || []).forEach((st: any) => {
        if (st.image_url) strainMap.set(st.name.toLowerCase(), st.image_url);
      });
      for (const p of flowerProducts as Array<{ id: string; name: string }>) {
        const url = strainMap.get(p.name.toLowerCase());
        if (url) {
          const { error: pErr } = await supabase
            .from("products")
            .update({ image_url: url })
            .eq("id", p.id);
          if (!pErr) productsUpdated++;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        productsUpdated,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ success: false, error: (e as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
