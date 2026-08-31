import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const bodyText = await req.text();
    let body;
    try { body = JSON.parse(bodyText); } catch { body = {}; }

    // Mercado Pago pode mandar ID na query string (data.id) ou no corpo.
    const paymentId = url.searchParams.get("data.id") || body?.data?.id || body?.resource?.split('/').pop();
    const type = url.searchParams.get("type") || body?.type;

    if (!paymentId || type !== 'payment') {
      return new Response("Not a payment event", { status: 200 });
    }

    const mpAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mpAccessToken) throw new Error("Missing MERCADOPAGO_ACCESS_TOKEN");

    // 1. Verify Payment direct via API
    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { "Authorization": `Bearer ${mpAccessToken}` }
    });

    if (!mpResponse.ok) {
      console.error("Failed to fetch payment from MP");
      return new Response("Error querying MP", { status: 500 });
    }

    const paymentData = await mpResponse.json();
    
    // Check if it's an approved payment
    if (paymentData.status !== 'approved') {
      console.log(`Payment ${paymentId} is ${paymentData.status}. Ignoring.`);
      return new Response("Payment not approved", { status: 200 });
    }

    const orderId = paymentData.external_reference;
    if (!orderId) {
      console.error(`Payment ${paymentId} has no external_reference`);
      return new Response("Missing external reference", { status: 200 });
    }

    // 2. Safely Process Payment (Idempotent via RPC)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: processed, error: rpcError } = await supabaseAdmin.rpc('process_mercadopago_payment', {
      p_order_id: orderId,
      p_payment_id: paymentId
    });

    if (rpcError) {
      console.error(`RPC Error for order ${orderId}:`, rpcError);
      return new Response("Database error", { status: 500 });
    }

    if (processed) {
      console.log(`Successfully processed order ${orderId}`);
    } else {
      console.log(`Order ${orderId} was already processed. Ignoring.`);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response(error.message, { status: 500 });
  }
});
