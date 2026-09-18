import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const reqBody = await req.json()
    const { user_id, terms_version, privacy_version, terms_hash, privacy_hash } = reqBody

    // Extract real IP from headers (x-forwarded-for or similar)
    // Deno/Supabase standard:
    let ip = req.headers.get('x-forwarded-for')
    if (ip) {
      ip = ip.split(',')[0].trim()
    } else {
      ip = req.headers.get('x-real-ip')
    }

    const userAgent = req.headers.get('user-agent')

    const { error } = await supabaseClient
      .from('terms_acceptance')
      .insert({
        user_id,
        terms_version,
        privacy_version,
        terms_hash,
        privacy_hash,
        ip_address: ip,
        user_agent: userAgent
      })

    if (error) {
      console.error(error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
