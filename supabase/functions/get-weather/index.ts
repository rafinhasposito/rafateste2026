import { corsHeaders } from '@supabase/supabase-js/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, country } = await req.json()
    if (!city) {
      return new Response(JSON.stringify({ error: 'city is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY')
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const query = country ? `${city},${country}` : city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&lang=pt_br&appid=${apiKey}`
    
    const res = await fetch(url)
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Weather data not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json()
    const result = {
      temp: Math.round(data.main?.temp ?? 0),
      feels_like: Math.round(data.main?.feels_like ?? 0),
      description: data.weather?.[0]?.description ?? '',
      icon: data.weather?.[0]?.icon ?? '01d',
      humidity: data.main?.humidity ?? 0,
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
