import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

interface TokenRow {
  id: string;
  domain_prefix: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

async function getValidToken(supabase: SupabaseClient): Promise<TokenRow> {
  const { data, error } = await supabase
    .from("lightspeed_tokens")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) throw new Error("Lightspeed not connected. Connect first.");

  const expiresAt = new Date(data.expires_at).getTime();
  // Refresh if less than 60s left
  if (expiresAt - Date.now() > 60_000) return data as TokenRow;

  // Refresh
  const body = new URLSearchParams({
    refresh_token: data.refresh_token,
    client_id: Deno.env.get("LIGHTSPEED_CLIENT_ID")!,
    client_secret: Deno.env.get("LIGHTSPEED_CLIENT_SECRET")!,
    grant_type: "refresh_token",
  });

  const res = await fetch(
    `https://${data.domain_prefix}.retail.lightspeed.app/api/1.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    },
  );

  if (!res.ok) throw new Error(`Refresh failed: ${await res.text()}`);
  const refreshed = await res.json();

  const updated = {
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token,
    expires_at: new Date(refreshed.expires * 1000).toISOString(),
    scope: refreshed.scope,
  };

  await supabase.from("lightspeed_tokens").update(updated).eq("id", data.id);

  return { ...data, ...updated } as TokenRow;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function uploadImage(
  supabase: SupabaseClient,
  imageUrl: string,
  productId: string,
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
    const bytes = new Uint8Array(await res.arrayBuffer());
    const path = `lightspeed/${productId}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, bytes, { contentType, upsert: true });

    if (error) {
      console.error("Image upload failed", error);
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  } catch (e) {
    console.error("Image fetch failed", e);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const token = await getValidToken(supabase);

    let pageToken: string | null = null;
    let totalSynced = 0;
    const errors: string[] = [];

    do {
      const url = new URL(
        `https://${token.domain_prefix}.retail.lightspeed.app/api/2.0/products`,
      );
      url.searchParams.set("page_size", "200");
      if (pageToken) url.searchParams.set("after", pageToken);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });

      if (!res.ok) {
        throw new Error(`Lightspeed API ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      const products: any[] = json.data || [];

      for (const p of products) {
        try {
          if (p.is_active === false || p.deleted_at) continue;

          const name: string = p.name || p.variant_name || "Unnamed";
          const lightspeedId: string = p.id;
          const sku: string = p.sku || "";
          const description: string = p.description || "";
          const priceIncl = Number(p.price_including_tax ?? p.price_excluding_tax ?? 0);
          const category: string =
            p.product_category?.name || p.type?.name || "Uncategorized";

          // Find image URL from images array
          let imageUrl = "";
          if (Array.isArray(p.images) && p.images.length > 0) {
            const lightspeedImg = p.images[0].url || p.images[0].image_url;
            if (lightspeedImg) {
              const uploaded = await uploadImage(supabase, lightspeedImg, lightspeedId);
              if (uploaded) imageUrl = uploaded;
            }
          } else if (p.image_url || p.image_thumbnail_url) {
            const uploaded = await uploadImage(
              supabase,
              p.image_url || p.image_thumbnail_url,
              lightspeedId,
            );
            if (uploaded) imageUrl = uploaded;
          }

          // Check if existing
          const { data: existing } = await supabase
            .from("products")
            .select("id, image_url, description")
            .eq("lightspeed_id", lightspeedId)
            .maybeSingle();

          const slug = slugify(name) + "-" + lightspeedId.slice(0, 6);

          const row: any = {
            lightspeed_id: lightspeedId,
            name,
            slug,
            sku,
            category,
            price: priceIncl,
            in_stock: true,
            visible: true,
          };

          // Only overwrite image if we got a new one, otherwise keep existing
          if (imageUrl) row.image_url = imageUrl;
          else if (!existing?.image_url) row.image_url = "";

          // Only set description if new (don't clobber AI-edited descriptions)
          if (!existing?.description) row.description = description;

          if (existing) {
            await supabase.from("products").update(row).eq("id", existing.id);
          } else {
            await supabase.from("products").insert(row);
          }

          totalSynced++;
        } catch (perProductErr) {
          console.error("Product sync error", perProductErr);
          errors.push(`${p.name}: ${(perProductErr as Error).message}`);
        }
      }

      pageToken = json.version?.max ? String(json.version.max) : null;
      // Stop if no more
      if (products.length < 200) pageToken = null;
    } while (pageToken);

    await supabase
      .from("lightspeed_tokens")
      .update({ last_sync_at: new Date().toISOString() })
      .eq("id", token.id);

    return new Response(
      JSON.stringify({ success: true, synced: totalSynced, errors: errors.slice(0, 10) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ success: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
