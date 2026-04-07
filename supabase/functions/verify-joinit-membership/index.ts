// Get your access token from: https://app.joinit.com/settings/api
import { corsHeaders } from '@supabase/supabase-js/cors'

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

    if (!response.ok) {
      console.error('Join It API error:', response.status, await response.text())
      return new Response(
        JSON.stringify({ verified: false, email, error: 'Could not reach Join It API' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    // Join It returns status 100 for Active members
    if (data && data.status === 100) {
      return new Response(
        JSON.stringify({ verified: true, email, status: 'Active' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ verified: false, email, status: 'Inactive' }),
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
