// Get your access token from: https://app.joinit.com/settings/api
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
        JSON.stringify({ verified: false, email, status: 'Not Found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!response.ok) {
      console.error('Join It API error:', response.status, await response.text())
      return new Response(
        JSON.stringify({ verified: false, email, error: 'Could not reach Join It API' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('Join It response:', JSON.stringify(data))

    // Broaden active check: status 100, or active/is_active flags
    const isActive = data.status === 100 || data.active === true || data.is_active === true
    
    if (isActive) {
      return new Response(
        JSON.stringify({ verified: true, email, status: 'Active', joinit_status: data.status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ verified: false, email, status: 'Inactive', joinit_status: data.status }),
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
