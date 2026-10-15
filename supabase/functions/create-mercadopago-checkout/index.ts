import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Extract Bearer Token & Check Auth explicitly
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '')?.trim();

    if (!token) {
      console.error("[create-checkout] No Authorization header provided");
      return new Response(
        JSON.stringify({ error: 'Missing authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      console.error("[create-checkout] Auth verification error:", authError);
      return new Response(
        JSON.stringify({ error: `Unauthorized: ${authError?.message || 'Invalid session'}` }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { pricing_config_id } = await req.json();
    if (!pricing_config_id) {
      return new Response(JSON.stringify({ error: 'pricing_config_id is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 2. Fetch Pricing Config
    const { data: pricingConfig, error: pricingError } = await supabaseAdmin
      .from('pricing_config')
      .select('*')
      .eq('key', pricing_config_id)
      .single();

    if (pricingError || !pricingConfig) {
      return new Response(JSON.stringify({ error: 'Invalid pricing package' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3. Create Pending Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('credit_orders')
      .insert({
        user_id: user.id,
        pricing_config_id: pricingConfig.key,
        amount: pricingConfig.price_brl,
        credits_amount: pricingConfig.credits,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Error creating order: ${orderError?.message}`);
    }

    // 4. Create Mercado Pago Preference
    const mpAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mpAccessToken) {
      throw new Error("Missing MERCADOPAGO_ACCESS_TOKEN");
    }

    const appUrl = Deno.env.get('APP_URL') ?? 'http://localhost:3000';
    // Em produção, você deverá configurar o Notification URL real da edge function mercadopago-webhook
    // Ex: https://xxx.supabase.co/functions/v1/mercadopago-webhook
    const notificationUrl = Deno.env.get('MERCADOPAGO_NOTIFICATION_URL');

    const preferencePayload = {
      items: [
        {
          id: pricingConfig.key,
          title: pricingConfig.label,
          description: pricingConfig.description || `Pacote de ${pricingConfig.credits} créditos`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: pricingConfig.price_brl,
        }
      ],
      payer: {
        email: user.email,
      },
      back_urls: {
        success: `${appUrl}/credits?status=success`,
        pending: `${appUrl}/credits?status=pending`,
        failure: `${appUrl}/credits?status=failure`,
      },
      auto_return: "approved",
      external_reference: order.id,
      notification_url: notificationUrl || undefined
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${mpAccessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preferencePayload)
    });

    if (!mpResponse.ok) {
      const errorData = await mpResponse.text();
      console.error("MP Error:", errorData);
      throw new Error("Failed to create Mercado Pago preference");
    }

    const preferenceData = await mpResponse.json();

    // 5. Update Order with Preference ID
    await supabaseAdmin
      .from('credit_orders')
      .update({ mercadopago_preference_id: preferenceData.id })
      .eq('id', order.id);

    // 6. Return Checkout URL
    // Se o token for de produção (inicia com APP_USR) ou MP_ENVIRONMENT for production, usa init_point real.
    const isProduction = mpAccessToken.startsWith('APP_USR-') || 
                         Deno.env.get('MP_ENVIRONMENT')?.trim().toLowerCase() === 'production';
    const checkoutUrl = isProduction 
      ? preferenceData.init_point 
      : preferenceData.sandbox_init_point;

    console.log(`[create-checkout] Created preference ${preferenceData.id}, isProduction: ${isProduction}`);

    return new Response(JSON.stringify({ checkoutUrl, orderId: order.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
