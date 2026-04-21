import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const error = url.searchParams.get("error");
    if (error) {
      return htmlResponse(`<h1>Lightspeed authorization declined</h1><p>${error}</p>`);
    }

    const code = url.searchParams.get("code");
    const domainPrefix = url.searchParams.get("domain_prefix");
    if (!code || !domainPrefix) {
      return htmlResponse(`<h1>Missing parameters</h1><p>Expected code and domain_prefix.</p>`);
    }

    const clientId = Deno.env.get("LIGHTSPEED_CLIENT_ID")!;
    const clientSecret = Deno.env.get("LIGHTSPEED_CLIENT_SECRET")!;
    const projectRef = Deno.env.get("SUPABASE_URL")!.match(/https:\/\/([^.]+)\./)![1];
    const redirectUri = `https://${projectRef}.supabase.co/functions/v1/lightspeed-oauth-callback`;

    // Exchange code for token
    const body = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch(
      `https://${domainPrefix}.retail.lightspeed.app/api/1.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      },
    );

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("Token exchange failed", tokenRes.status, text);
      return htmlResponse(`<h1>Token exchange failed</h1><pre>${text}</pre>`);
    }

    const token = await tokenRes.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Single-row pattern: delete then insert
    await supabase.from("lightspeed_tokens").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const { error: insertError } = await supabase.from("lightspeed_tokens").insert({
      domain_prefix: token.domain_prefix || domainPrefix,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: new Date(token.expires * 1000).toISOString(),
      scope: token.scope,
    });

    if (insertError) {
      console.error("Insert failed", insertError);
      return htmlResponse(`<h1>Could not save tokens</h1><pre>${insertError.message}</pre>`);
    }

    // Redirect back to admin
    const appOrigin = req.headers.get("origin") || "https://thedivinecollective.co.za";
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${appOrigin}/admin?lightspeed=connected`,
      },
    });
  } catch (e) {
    console.error(e);
    return htmlResponse(`<h1>Unexpected error</h1><pre>${(e as Error).message}</pre>`);
  }
});

function htmlResponse(html: string) {
  return new Response(
    `<!doctype html><html><body style="font-family:system-ui;padding:2rem;max-width:600px;margin:auto">${html}<p><a href="/admin">Back to admin</a></p></body></html>`,
    { headers: { "Content-Type": "text/html" } },
  );
}
