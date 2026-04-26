import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "product-images";
const UA =
  "Mozilla/5.0 (compatible; DivineCollectiveImporter/1.0; +https://thedivinecollective.co.za)";

interface CsvItem {
  sku?: string;
  imageUrl?: string;
  name?: string;
}

const guessExtFromUrl = (url: string) => {
  const m = url.match(/\.(png|jpe?g|webp|avif|gif)(\?|$)/i);
  if (!m) return "jpg";
  return m[1].toLowerCase().replace("jpeg", "jpg");
};

const contentTypeForExt = (ext: string) => {
  switch (ext) {
    case "png": return "image/png";
    case "webp": return "image/webp";
    case "avif": return "image/avif";
    case "gif": return "image/gif";
    default: return "image/jpeg";
  }
};

async function downloadImage(
  url: string,
): Promise<{ bytes: Uint8Array; ext: string; ct: string } | null> {
  // Try HTTPS first, fall back to HTTP
  const tryUrls = [url, url.replace(/^https:\/\//i, "http://")];
  for (const u of tryUrls) {
    try {
      const res = await fetch(u, {
        headers: { "User-Agent": UA, Accept: "image/*,*/*" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) continue;
      const ct = res.headers.get("content-type") || "";
      const buf = new Uint8Array(await res.arrayBuffer());
      if (buf.byteLength < 200) continue;
      const ext = guessExtFromUrl(u);
      return { bytes: buf, ext, ct: ct.startsWith("image/") ? ct : contentTypeForExt(ext) };
    } catch {
      // try next
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const items: CsvItem[] = Array.isArray(body?.items) ? body.items : [];
    const force: boolean = !!body?.force;

    if (items.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No items provided" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Load all products with SKUs to map SKU -> product
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id, name, slug, sku, image_url")
      .limit(5000);
    if (pErr) throw pErr;

    const bySku = new Map<string, { id: string; name: string; slug: string; image_url: string | null }>();
    for (const p of products || []) {
      if (p.sku) bySku.set(String(p.sku).trim(), p as any);
    }

    const results: Array<{
      sku: string;
      csvName?: string;
      productName?: string;
      action: "downloaded" | "skipped_has_image" | "failed_download" | "not_in_db" | "no_image_url" | "failed_upload";
      sourceUrl?: string;
      newUrl?: string;
      error?: string;
    }> = [];

    let downloaded = 0;
    let matched = 0;
    let skipped = 0;
    let failed = 0;
    let notInDb = 0;
    let noUrl = 0;

    for (const item of items) {
      const sku = String(item.sku || "").trim();
      const url = String(item.imageUrl || "").trim();

      if (!sku) continue;

      const product = bySku.get(sku);
      if (!product) {
        notInDb++;
        results.push({ sku, csvName: item.name, action: "not_in_db" });
        continue;
      }
      matched++;

      if (!url) {
        noUrl++;
        results.push({ sku, csvName: item.name, productName: product.name, action: "no_image_url" });
        continue;
      }

      const isSupabaseHosted =
        product.image_url && product.image_url.includes("/storage/v1/object/public/product-images/");
      if (isSupabaseHosted && !force) {
        skipped++;
        results.push({ sku, csvName: item.name, productName: product.name, action: "skipped_has_image" });
        continue;
      }

      const dl = await downloadImage(url);
      if (!dl) {
        failed++;
        results.push({
          sku, csvName: item.name, productName: product.name,
          action: "failed_download", sourceUrl: url,
        });
        continue;
      }

      try {
        const path = `${product.slug || "product"}-${Date.now()}.${dl.ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, dl.bytes, { contentType: dl.ct, upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const newUrl = pub.publicUrl;

        const { error: updErr } = await supabase
          .from("products")
          .update({ image_url: newUrl })
          .eq("id", product.id);
        if (updErr) throw updErr;

        downloaded++;
        results.push({
          sku, csvName: item.name, productName: product.name,
          action: "downloaded", sourceUrl: url, newUrl,
        });
      } catch (e) {
        failed++;
        results.push({
          sku, csvName: item.name, productName: product.name,
          action: "failed_upload", sourceUrl: url, error: (e as Error).message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        csvRows: items.length,
        matchedBySku: matched,
        downloaded,
        skipped,
        failed,
        notInDb,
        noUrl,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ success: false, error: (e as Error).message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
