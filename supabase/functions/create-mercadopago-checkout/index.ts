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
    const rawToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') || '';
    const mpAccessToken = rawToken.trim().replace(/^["']|["']$/g, '');
    if (!mpAccessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado nas Secrets do Supabase");
    }

    const isProduction = mpAccessToken.startsWith('APP_USR-') || 
                         Deno.env.get('MP_ENVIRONMENT')?.trim().toLowerCase() === 'production';

    // Resolve appUrl dynamically: check APP_URL, then origin header, fallback to production domain
    let appUrl = (Deno.env.get('APP_URL') || '').trim().replace(/\/$/, '').replace(/^["']|["']$/g, '');
    if (!appUrl) {
      const origin = req.headers.get('origin') || req.headers.get('referer');
      if (origin) {
        try {
          const parsed = new URL(origin);
          // Em produção, o Mercado Pago proíbe estritamente localhost nas back_urls
          if (isProduction && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
            appUrl = 'https://protocolosolar.com.br';
          } else {
            appUrl = `${parsed.protocol}//${parsed.host}`;
          }
        } catch {
          appUrl = 'https://protocolosolar.com.br';
        }
      } else {
        appUrl = 'https://protocolosolar.com.br';
      }
    } else if (isProduction && (appUrl.includes('localhost') || appUrl.includes('127.0.0.1'))) {
      appUrl = 'https://protocolosolar.com.br';
    }

    // Resolve notificationUrl: check MERCADOPAGO_NOTIFICATION_URL, fallback to Supabase Edge Function URL
    const rawNotif = (Deno.env.get('MERCADOPAGO_NOTIFICATION_URL') || '').trim().replace(/^["']|["']$/g, '');
    const supabaseUrl = (Deno.env.get('SUPABASE_URL') || '').trim().replace(/\/$/, '');
    const defaultNotificationUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/mercadopago-webhook` : undefined;
    const notificationUrl = rawNotif || defaultNotificationUrl;

    const userEmail = (user.email && user.email.includes('@')) 
      ? user.email 
      : 'contato@protocolosolar.com.br';

    const unitPrice = Number(pricingConfig.price_brl);
    if (isNaN(unitPrice) || unitPrice <= 0) {
      throw new Error(`Preço inválido para o pacote ${pricingConfig.key}: ${pricingConfig.price_brl}`);
    }

    const preferencePayload: Record<string, any> = {
      items: [
        {
          id: String(pricingConfig.key),
          title: String(pricingConfig.label),
          description: String(pricingConfig.description || `Pacote de ${pricingConfig.credits} créditos`),
          quantity: 1,
          currency_id: "BRL",
          unit_price: unitPrice,
        }
      ],
      back_urls: {
        success: `${appUrl}/credits?status=success`,
        pending: `${appUrl}/credits?status=pending`,
        failure: `${appUrl}/credits?status=failure`,
      },
      auto_return: "approved",
      external_reference: String(order.id),
    };

    if (notificationUrl) {
      preferencePayload.notification_url = notificationUrl;
    }

    console.log(`[create-checkout] Creating preference for user ${user.id}, order ${order.id}, appUrl: ${appUrl}, isProduction: ${isProduction}`);

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
      console.error("[create-checkout] MP API Error:", mpResponse.status, errorData);
      let detailMsg = errorData;
      try {
        const parsed = JSON.parse(errorData);
        detailMsg = parsed.message || parsed.error || errorData;
        if (parsed.cause && Array.isArray(parsed.cause)) {
          const causes = parsed.cause.map((c: any) => c.description || c.code).join(", ");
          detailMsg += ` - ${causes}`;
        }
      } catch {}

      if (mpResponse.status === 403 && detailMsg.toLowerCase().includes("policy")) {
        detailMsg = "Credenciais de Produção não ativadas no Mercado Pago. Acesse o Painel de Desenvolvedores do Mercado Pago e conclua o formulário 'Ativar credenciais de produção'.";
      }

      throw new Error(`Mercado Pago (${mpResponse.status}): ${detailMsg}`);
    }

    const preferenceData = await mpResponse.json();

    // 5. Update Order with Preference ID
    await supabaseAdmin
      .from('credit_orders')
      .update({ mercadopago_preference_id: preferenceData.id })
      .eq('id', order.id);

    // 6. Return Checkout URL
    // Se o token for de produção (inicia com APP_USR) ou MP_ENVIRONMENT for production, usa init_point real.
    const checkoutUrl = isProduction 
      ? (preferenceData.init_point || preferenceData.sandbox_init_point)
      : (preferenceData.sandbox_init_point || preferenceData.init_point);

    console.log(`[create-checkout] Created preference ${preferenceData.id}, isProduction: ${isProduction}`);

    const publicKey = (Deno.env.get('MERCADOPAGO_PUBLIC_KEY') || '').trim().replace(/^["']|["']$/g, '') || 'APP_USR-696a532b-8901-4941-9361-8ce2722c133b';

    return new Response(JSON.stringify({ 
      checkoutUrl, 
      preferenceId: preferenceData.id, 
      orderId: order.id,
      publicKey
    }), {
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
