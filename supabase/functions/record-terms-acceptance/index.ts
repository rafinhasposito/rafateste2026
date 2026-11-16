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

    if (!user_id || !terms_version || !privacy_version || !terms_hash || !privacy_hash) {
      return new Response(
        JSON.stringify({ error: 'Parâmetros obrigatórios ausentes' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verify caller identity: either a valid Bearer token matching user_id,
    // or a newly registered user (within 10 min) who hasn't recorded this terms version yet.
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '')?.trim()
    let isVerifiedCaller = false

    if (token) {
      const { data: { user: authUser } } = await supabaseClient.auth.getUser(token)
      if (authUser && authUser.id === user_id) {
        isVerifiedCaller = true
      }
    }

    if (!isVerifiedCaller) {
      const { data: adminUserRes, error: adminUserErr } = await supabaseClient.auth.admin.getUserById(user_id)
      const createdAtMs = adminUserRes?.user?.created_at ? new Date(adminUserRes.user.created_at).getTime() : 0
      const isRecentSignup = createdAtMs > 0 && (Date.now() - createdAtMs) <= 10 * 60 * 1000

      if (adminUserErr || !adminUserRes?.user || !isRecentSignup) {
        return new Response(
          JSON.stringify({ error: 'Não autorizado a registrar aceite para este usuário' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      const { count } = await supabaseClient
        .from('terms_acceptance')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user_id)
        .eq('terms_version', terms_version)

      if ((count ?? 0) > 0) {
        return new Response(
          JSON.stringify({ success: true, alreadyRecorded: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

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
