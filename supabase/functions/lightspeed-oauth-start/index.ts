import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const SCOPES = [
  "products:read",
  "product_categories:read",
  "product_brands:read",
  "product_types:read",
  "inventory:read",
].join(" ");

Deno.serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientId = Deno.env.get("LIGHTSPEED_CLIENT_ID");
  if (!clientId) {
    return new Response(
      JSON.stringify({ error: "LIGHTSPEED_CLIENT_ID not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const projectRef = Deno.env.get("SUPABASE_URL")!.match(/https:\/\/([^.]+)\./)![1];
  const redirectUri = `https://${projectRef}.supabase.co/functions/v1/lightspeed-oauth-callback`;

  // Generate random state for CSRF protection (min 8 chars)
  const state = crypto.randomUUID().replace(/-/g, "");

  const url = new URL("https://secure.retail.lightspeed.app/connect");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", SCOPES);

  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: url.toString(),
    },
  });
});
