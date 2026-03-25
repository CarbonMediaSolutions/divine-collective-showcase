import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, item_name, email, phone_number, payment_type, success_url, cancel_url } = await req.json();

    // Input validation
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!item_name || !payment_type) {
      return new Response(JSON.stringify({ error: 'item_name and payment_type are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('BOBPAY_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'BobPay API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const custom_payment_id = `${payment_type}_${crypto.randomUUID()}`;

    const bobPayBody: Record<string, unknown> = {
      recipient_account_code: 'DIV001',
      custom_payment_id,
      amount: Number(amount),
      item_name,
      success_url: success_url || '',
      cancel_url: cancel_url || '',
      short_url: true,
    };

    if (email) bobPayBody.email = email;
    if (phone_number) bobPayBody.phone_number = phone_number;

    console.log('Calling BobPay API with:', JSON.stringify(bobPayBody));

    const response = await fetch('https://api.sandbox.bobpay.co.za/payments/intents/link', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bobPayBody),
    });

    const data = await response.text();
    console.log('BobPay response:', response.status, data);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'BobPay API error', details: data }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parsed = JSON.parse(data);

    return new Response(JSON.stringify({
      url: parsed.short_url || parsed.url || parsed.payment_url,
      reference: custom_payment_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
