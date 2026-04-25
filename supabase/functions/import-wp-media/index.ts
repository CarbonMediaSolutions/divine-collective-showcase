import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "product-images";
const WP_BASE = "http://tdc.carbonmediasolutions.com";
const UA =
  "Mozilla/5.0 (compatible; DivineCollectiveImporter/1.0; +https://thedivinecollective.co.za)";

interface MediaItem {
  id: number;
  source_url: string;
  title: { rendered: string };
  slug: string;
  media_details?: {
    sizes?: Record<string, { source_url: string }>;
  };
}

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  image_url: string | null;
}

const STOPWORDS = new Set([
  "the", "a", "an", "of", "and", "or", "for", "with", "in", "on", "to",
  "ml", "mg", "g", "kg", "pack", "piece", "pcs",
]);

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokens = (s: string) =>
  norm(s)
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));

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

const isImageUrl = (url: string) =>
  /\.(png|jpe?g|webp|avif|gif)(\?|$)/i.test(url);

// Force HTTP because the subdomain has no SSL cert
const forceHttp = (url: string) => url.replace(/^https:\/\//i, "http://");

async function fetchAllMedia(): Promise<MediaItem[]> {
  const all: MediaItem[] = [];
  let page = 1;
  while (page <= 20) {
    const res = await fetch(
      `${WP_BASE}/?rest_route=/wp/v2/media&per_page=100&page=${page}`,
      { headers: { "User-Agent": UA, Accept: "application/json" } },
    );
    if (!res.ok) break;
    const batch = (await res.json()) as MediaItem[];
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return all;
}

interface MediaCandidate {
  url: string;
  titleTokens: string[];
  fileTokens: string[];
  allText: string;
}

function buildCandidates(items: MediaItem[]): MediaCandidate[] {
  const out: MediaCandidate[] = [];
  for (const m of items) {
    if (!m.source_url || !isImageUrl(m.source_url)) continue;
    const filename = m.source_url.split("/").pop()?.split("?")[0] || "";
    const fileBase = filename.replace(/\.[^.]+$/, "").replace(/-\d+x\d+$/, "");
    const title = m.title?.rendered || "";
    out.push({
      url: m.source_url,
      titleTokens: tokens(title),
      fileTokens: tokens(fileBase),
      allText: norm(`${title} ${fileBase} ${m.slug || ""}`),
    });
  }
  return out;
}

function findBestMatch(
  productName: string,
  candidates: MediaCandidate[],
): MediaCandidate | null {
  const productTokens = tokens(productName);
  if (productTokens.length === 0) return null;
  const productNorm = norm(productName);

  // 1. Exact normalized title match
  for (const c of candidates) {
    if (c.titleTokens.join(" ") === productTokens.join(" ")) return c;
  }

  // 2. Best token-overlap score against title (preferred) then filename
  let best: { c: MediaCandidate; score: number } | null = null;
  for (const c of candidates) {
    if (c.titleTokens.length === 0 && c.fileTokens.length === 0) continue;

    const target = c.titleTokens.length > 0 ? c.titleTokens : c.fileTokens;
    const targetSet = new Set(target);
    let hits = 0;
    for (const t of productTokens) if (targetSet.has(t)) hits++;
    if (hits === 0) continue;

    const ratio = hits / productTokens.length;
    // Require at least 60% of meaningful product words to appear
    if (ratio < 0.6) continue;

    // Score: ratio + small bonus for exact substring match in combined text
    let score = ratio;
    if (c.allText.includes(productNorm)) score += 0.5;
    // Penalty for very long unrelated titles
    score -= Math.max(0, target.length - productTokens.length) * 0.02;

    if (!best || score > best.score) best = { c, score };
  }

  return best ? best.c : null;
}

async function downloadImage(
  url: string,
): Promise<{ bytes: Uint8Array; ext: string; ct: string } | null> {
  try {
    const res = await fetch(forceHttp(url), {
      headers: { "User-Agent": UA, Accept: "image/*,*/*" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.startsWith("image/") && !isImageUrl(url)) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength < 200) return null; // probably an error page
    const ext = guessExtFromUrl(url);
    return { bytes: buf, ext, ct: ct || contentTypeForExt(ext) };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let dryRun = false;
    let onlyMissing = true;
    try {
      if (req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        if (typeof body?.dryRun === "boolean") dryRun = body.dryRun;
        if (typeof body?.onlyMissing === "boolean") onlyMissing = body.onlyMissing;
      }
    } catch { /* ignore */ }

    // Step 1: pull WP media
    const media = await fetchAllMedia();
    const candidates = buildCandidates(media);

    // Step 2: load products needing images
    let q = supabase.from("products").select("id, name, slug, category, image_url").limit(2000);
    const { data: products, error: pErr } = await q;
    if (pErr) throw pErr;

    const targets = ((products || []) as DbProduct[]).filter((p) => {
      if (!onlyMissing) return true;
      const url = p.image_url || "";
      if (!url) return true;
      if (url.includes("thedivinecollective.co.za/wp-content")) return true;
      if (url.includes("/placeholder.svg")) return true;
      return false;
    });

    const results: Array<{
      product: string;
      category: string;
      action: "matched" | "downloaded" | "file_missing" | "no_match" | "skipped" | "failed";
      sourceUrl?: string;
      newUrl?: string;
      error?: string;
    }> = [];

    let downloaded = 0;
    let matched = 0;
    let fileMissing = 0;
    let noMatch = 0;

    for (const p of targets) {
      const match = findBestMatch(p.name, candidates);
      if (!match) {
        noMatch++;
        results.push({ product: p.name, category: p.category, action: "no_match" });
        continue;
      }
      matched++;

      if (dryRun) {
        results.push({
          product: p.name,
          category: p.category,
          action: "matched",
          sourceUrl: match.url,
        });
        continue;
      }

      const dl = await downloadImage(match.url);
      if (!dl) {
        fileMissing++;
        results.push({
          product: p.name,
          category: p.category,
          action: "file_missing",
          sourceUrl: match.url,
        });
        continue;
      }

      try {
        const path = `${p.slug || "product"}-${Date.now()}.${dl.ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, dl.bytes, { contentType: dl.ct, upsert: true });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const newUrl = pub.publicUrl;

        const { error: updErr } = await supabase
          .from("products")
          .update({ image_url: newUrl })
          .eq("id", p.id);
        if (updErr) throw updErr;

        downloaded++;
        results.push({
          product: p.name,
          category: p.category,
          action: "downloaded",
          sourceUrl: match.url,
          newUrl,
        });
      } catch (e) {
        results.push({
          product: p.name,
          category: p.category,
          action: "failed",
          sourceUrl: match.url,
          error: (e as Error).message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        dryRun,
        mediaItems: media.length,
        productsConsidered: targets.length,
        matched,
        downloaded,
        fileMissing,
        noMatch,
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
