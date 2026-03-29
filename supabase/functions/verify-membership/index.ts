import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("members")
      .select("status, expiration_date")
      .eq("email", email.toLowerCase().trim())
      .in("status", ["Active", "Pending"])
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return new Response(
        JSON.stringify({ valid: false, expiresAt: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const member = data[0];
    const expiresAt = member.expiration_date;
    const valid =
      member.status === "Active" &&
      expiresAt != null &&
      new Date(expiresAt) > new Date();

    return new Response(
      JSON.stringify({ valid, expiresAt }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
