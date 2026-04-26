// Get your access token from: https://app.joinit.com/settings/api
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function extractFirstName(data: any): string | null {
  // Try common Join It shapes
  const m = data?.memberships?.[0];
  const candidates = [
    data?.first_name,
    data?.contact?.first_name,
    m?.first_name,
    m?.contact?.first_name,
    m?.member?.first_name,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim().split(/\s+/)[0];
  }
  // Fall back to splitting a full name field
  const names = [
    data?.name,
    data?.full_name,
    m?.name,
    m?.contact?.name,
    m?.member?.name,
  ];
  for (const n of names) {
    if (typeof n === 'string' && n.trim()) return n.trim().split(/\s+/)[0];
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ verified: false, error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = Deno.env.get('JOINIT_ACCESS_TOKEN')
    if (!token) {
      console.error('JOINIT_ACCESS_TOKEN not configured')
      return new Response(
        JSON.stringify({ verified: false, error: 'Could not reach Join It API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = `https://app.joinitapi.com/api/v1/organizations/me/verify_membership?email=${encodeURIComponent(email.trim())}`
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    // Handle 404 specifically — means no membership found
    if (response.status === 404) {
      const body = await response.text()
      console.log('Join It 404 response:', body)
      return new Response(
        JSON.stringify({ verified: false, email, status: 'Not Found', first_name: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!response.ok) {
      console.error('Join It API error:', response.status, await response.text())
      return new Response(
        JSON.stringify({ verified: false, email, error: 'Could not reach Join It API', first_name: null }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('Join It response:', JSON.stringify(data))

    const isActive = data.verified === true ||
      (data.memberships && data.memberships.length > 0 && data.memberships[0].status === 100) ||
      data.status === 100

    const firstName = extractFirstName(data);

    if (isActive) {
      return new Response(
        JSON.stringify({ verified: true, email, status: 'Active', first_name: firstName }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ verified: false, email, status: 'Inactive', joinit_status: data.status, first_name: firstName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error verifying membership:', err)
    return new Response(
      JSON.stringify({ verified: false, error: 'Could not reach Join It API' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
