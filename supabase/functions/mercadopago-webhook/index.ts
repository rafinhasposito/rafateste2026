import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  // Respond OK to preflight checks
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const url = new URL(req.url);
    const bodyText = await req.text();
    let body: any = {};
    try { 
      if (bodyText) body = JSON.parse(bodyText); 
    } catch { 
      body = {}; 
    }

    // Mercado Pago envia notificações em múltiplos formatos:
    // 1. IPN: query params ?topic=payment&id=123456
    // 2. Webhook v2: body { action: "payment.created"|"payment.updated", data: { id: "123456" }, type: "payment" }
    // 3. Webhook query: ?data.id=123456&type=payment
    // 4. Resource URL: resource "https://api.mercadolibre.com/v1/payments/123456"
    const paymentId = 
      url.searchParams.get("data.id") || 
      url.searchParams.get("id") || 
      body?.data?.id || 
      (typeof body?.id === 'string' || typeof body?.id === 'number' ? String(body.id) : null) ||
      (body?.resource ? body.resource.split('/').pop() : null);

    const type = 
      url.searchParams.get("type") || 
      url.searchParams.get("topic") || 
      body?.type || 
      (body?.action?.startsWith('payment.') ? 'payment' : null);

    const isPayment = type === 'payment' || (body?.action && body.action.includes('payment')) || (!type && paymentId);

    if (!paymentId || !isPayment) {
      console.log(`[mp-webhook] Ignored event (not a payment): paymentId=${paymentId}, type=${type}, action=${body?.action}`);
      return new Response("Not a payment event", { status: 200 });
    }

    const mpAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mpAccessToken) {
      console.error("[mp-webhook] Missing MERCADOPAGO_ACCESS_TOKEN environment variable");
      throw new Error("Missing MERCADOPAGO_ACCESS_TOKEN");
    }

    // 1. Verify Payment direct via MP API
    console.log(`[mp-webhook] Fetching payment details for ID: ${paymentId}...`);
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 
        "Authorization": `Bearer ${mpAccessToken}`,
        "Content-Type": "application/json"
      }
    });

    if (!mpResponse.ok) {
      const errText = await mpResponse.text();
      console.error(`[mp-webhook] Failed to fetch payment ${paymentId} from MP:`, errText);
      return new Response("Error querying MP", { status: 500 });
    }

    const paymentData = await mpResponse.json();
    console.log(`[mp-webhook] Payment ${paymentId} status: ${paymentData.status}, external_reference: ${paymentData.external_reference}`);
    
    // Check if it's an approved payment
    if (paymentData.status !== 'approved') {
      console.log(`[mp-webhook] Payment ${paymentId} status is '${paymentData.status}'. No credits granted yet.`);
      return new Response(`Payment not approved (${paymentData.status})`, { status: 200 });
    }

    const orderId = paymentData.external_reference;
    if (!orderId) {
      console.error(`[mp-webhook] Payment ${paymentId} has no external_reference`);
      return new Response("Missing external reference", { status: 200 });
    }

    // 2. Safely Process Payment (Idempotent via RPC)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: processed, error: rpcError } = await supabaseAdmin.rpc('process_mercadopago_payment', {
      p_order_id: orderId,
      p_payment_id: String(paymentId)
    });

    if (rpcError) {
      console.error(`[mp-webhook] RPC Error for order ${orderId}:`, rpcError);
      return new Response("Database error", { status: 500 });
    }

    if (processed) {
      console.log(`[mp-webhook] Successfully processed order ${orderId} and added credits to user profile`);
    } else {
      console.log(`[mp-webhook] Order ${orderId} was already processed. Idempotent ignore.`);
    }

    return new Response(JSON.stringify({ success: true, processed }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error: any) {
    console.error("[mp-webhook] Webhook Error:", error);
    return new Response(error.message, { status: 500 });
  }
});

