import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Extract Bearer Token & Verify User
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '')?.trim();

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: `Unauthorized: ${authError?.message || 'Invalid session'}` }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { action, pricing_config_id, payment_id, order_id, card_data } = body;

    const rawToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') || '';
    const mpAccessToken = rawToken.trim().replace(/^["']|["']$/g, '');
    if (!mpAccessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado nas Secrets do Supabase");
    }

    const publicKey = (Deno.env.get('MERCADOPAGO_PUBLIC_KEY') || '').trim().replace(/^["']|["']$/g, '') || 'APP_USR-696a532b-8901-4941-9361-8ce2722c133b';
    const rawNotif = (Deno.env.get('MERCADOPAGO_NOTIFICATION_URL') || '').trim().replace(/^["']|["']$/g, '');
    const supabaseUrl = (Deno.env.get('SUPABASE_URL') || '').trim().replace(/\/$/, '');
    const notificationUrl = rawNotif || (supabaseUrl ? `${supabaseUrl}/functions/v1/mercadopago-webhook` : undefined);

    // =========================================================================
    // ACTION 1: CHECK PAYMENT STATUS (Usado pelo polling do Pix em tempo real)
    // =========================================================================
    if (action === 'check_payment') {
      if (!payment_id || !order_id) {
        return new Response(JSON.stringify({ error: 'payment_id and order_id required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${payment_id}`, {
        headers: {
          "Authorization": `Bearer ${mpAccessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!mpRes.ok) {
        return new Response(JSON.stringify({ status: 'pending' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const paymentData = await mpRes.json();
      if (paymentData.status === 'approved') {
        await supabaseAdmin.rpc('process_mercadopago_payment', {
          p_order_id: order_id,
          p_payment_id: String(payment_id)
        });
      }

      return new Response(JSON.stringify({
        status: paymentData.status,
        statusDetail: paymentData.status_detail
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Para criar pagamento (Pix, Cartão ou Preferência), busca o pacote
    if (!pricing_config_id) {
      return new Response(JSON.stringify({ error: 'pricing_config_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: pricingConfig, error: pricingError } = await supabaseAdmin
      .from('pricing_config')
      .select('*')
      .eq('key', pricing_config_id)
      .single();

    if (pricingError || !pricingConfig) {
      return new Response(JSON.stringify({ error: 'Pacote de créditos inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const unitPrice = Number(pricingConfig.price_brl);
    if (isNaN(unitPrice) || unitPrice <= 0) {
      throw new Error(`Preço inválido para o pacote ${pricingConfig.key}`);
    }

    // Cria ou reutiliza pedido pendente
    let order: any = null;
    if (order_id) {
      const { data: existingOrder } = await supabaseAdmin
        .from('credit_orders')
        .select('*')
        .eq('id', order_id)
        .eq('user_id', user.id)
        .single();
      order = existingOrder;
    }

    if (!order) {
      const { data: newOrder, error: orderError } = await supabaseAdmin
        .from('credit_orders')
        .insert({
          user_id: user.id,
          pricing_config_id: pricingConfig.key,
          amount: unitPrice,
          credits_amount: pricingConfig.credits,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError || !newOrder) {
        throw new Error(`Erro ao criar pedido: ${orderError?.message}`);
      }
      order = newOrder;
    }

    const fallbackBuyerEmail = `cliente.${user.id.slice(0, 8)}@protocolosolar.com.br`;
    const primaryEmail = (user.email && user.email.includes('@')) ? user.email : fallbackBuyerEmail;

    // =========================================================================
    // ACTION 2: CREATE PIX (QR Code + Copia e Cola direto dentro do site)
    // =========================================================================
    if (action === 'create_pix') {
      const buildPixPayload = (emailToUse: string) => ({
        transaction_amount: unitPrice,
        description: `${pricingConfig.label} (${pricingConfig.credits} créditos) - Protocolo Solar`,
        payment_method_id: "pix",
        external_reference: String(order.id),
        ...(notificationUrl ? { notification_url: notificationUrl } : {}),
        payer: {
          email: emailToUse,
          first_name: user.user_metadata?.full_name?.split(' ')[0] || "Viajante",
        }
      });

      let mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${mpAccessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": `pix-${order.id}-1`
        },
        body: JSON.stringify(buildPixPayload(primaryEmail))
      });

      // Se o usuário estiver testando com o mesmo e-mail da conta Mercado Pago vendedora,
      // o MP bloqueia auto-pagamento; refazemos automaticamente com e-mail de comprador.
      if (!mpRes.ok && primaryEmail !== fallbackBuyerEmail) {
        mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${mpAccessToken}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": `pix-${order.id}-2`
          },
          body: JSON.stringify(buildPixPayload(fallbackBuyerEmail))
        });
      }

      if (!mpRes.ok) {
        const errText = await mpRes.text();
        console.error("[create-checkout] Pix Error:", mpRes.status, errText);
        let msg = errText;
        try {
          const parsed = JSON.parse(errText);
          msg = parsed.message || parsed.error || errText;
          if (Array.isArray(parsed.cause) && parsed.cause.length > 0) {
            msg += ` (${parsed.cause.map((c: any) => c.description || c.code).join(', ')})`;
          }
        } catch {}
        throw new Error(`Erro ao gerar Pix (${mpRes.status}): ${msg}`);
      }

      const paymentData = await mpRes.json();
      const txData = paymentData.point_of_interaction?.transaction_data;

      return new Response(JSON.stringify({
        orderId: order.id,
        paymentId: paymentData.id,
        status: paymentData.status,
        qrCode: txData?.qr_code || "",
        qrCodeBase64: txData?.qr_code_base64 || "",
        ticketUrl: txData?.ticket_url || "",
        publicKey
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =========================================================================
    // ACTION 3: PROCESS CARD (Pagamento com Cartão direto dentro do site)
    // =========================================================================
    if (action === 'process_card') {
      if (!card_data || !card_data.token) {
        throw new Error("Dados do cartão incompletos.");
      }

      const buildCardPayload = (emailToUse: string) => ({
        transaction_amount: unitPrice,
        token: card_data.token,
        description: `${pricingConfig.label} (${pricingConfig.credits} créditos) - Protocolo Solar`,
        installments: Number(card_data.installments) || 1,
        payment_method_id: card_data.payment_method_id,
        ...(card_data.issuer_id ? { issuer_id: card_data.issuer_id } : {}),
        external_reference: String(order.id),
        ...(notificationUrl ? { notification_url: notificationUrl } : {}),
        payer: {
          email: emailToUse,
          ...(card_data.payer?.identification ? { identification: card_data.payer.identification } : {})
        }
      });

      const cardPayerEmail = card_data.payer?.email || primaryEmail;
      let mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${mpAccessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": `card-${order.id}-${Date.now()}`
        },
        body: JSON.stringify(buildCardPayload(cardPayerEmail))
      });

      if (!mpRes.ok && cardPayerEmail !== fallbackBuyerEmail) {
        mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${mpAccessToken}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": `card-${order.id}-retry-${Date.now()}`
          },
          body: JSON.stringify(buildCardPayload(fallbackBuyerEmail))
        });
      }

      if (!mpRes.ok) {
        const errText = await mpRes.text();
        console.error("[create-checkout] Card Error:", mpRes.status, errText);
        let msg = "Não foi possível processar o cartão. Verifique os dados ou tente via Pix.";
        try {
          const parsed = JSON.parse(errText);
          if (parsed.message) msg = parsed.message;
        } catch {}
        throw new Error(msg);
      }

      const paymentData = await mpRes.json();

      if (paymentData.status === 'approved') {
        await supabaseAdmin.rpc('process_mercadopago_payment', {
          p_order_id: order.id,
          p_payment_id: String(paymentData.id)
        });
      }

      return new Response(JSON.stringify({
        orderId: order.id,
        paymentId: paymentData.id,
        status: paymentData.status,
        statusDetail: paymentData.status_detail
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // =========================================================================
    // FALLBACK: PREFERENCE CREATION
    // =========================================================================
    const isProduction = mpAccessToken.startsWith('APP_USR-') ||
                         Deno.env.get('MP_ENVIRONMENT')?.trim().toLowerCase() === 'production';

    const appUrl = 'https://protocolosolar.com.br';
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
      ...(notificationUrl ? { notification_url: notificationUrl } : {})
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
      throw new Error(`Mercado Pago (${mpResponse.status}): ${errorData}`);
    }

    const preferenceData = await mpResponse.json();
    await supabaseAdmin
      .from('credit_orders')
      .update({ mercadopago_preference_id: preferenceData.id })
      .eq('id', order.id);

    const checkoutUrl = isProduction
      ? (preferenceData.init_point || preferenceData.sandbox_init_point)
      : (preferenceData.sandbox_init_point || preferenceData.init_point);

    return new Response(JSON.stringify({
      checkoutUrl,
      preferenceId: preferenceData.id,
      orderId: order.id,
      publicKey
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("[create-checkout] Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Erro interno no servidor de pagamentos" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
