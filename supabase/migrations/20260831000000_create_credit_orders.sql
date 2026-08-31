CREATE TABLE IF NOT EXISTS public.credit_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pricing_config_id TEXT NOT NULL REFERENCES public.pricing_config(key) ON DELETE RESTRICT,
    amount NUMERIC NOT NULL,
    credits_amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BRL',
    status TEXT NOT NULL DEFAULT 'pending',
    mercadopago_preference_id TEXT,
    mercadopago_payment_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.credit_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
    ON public.credit_orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Insert/Update is restricted to Service Role (Edge Functions)

-- Idempotent RPC to process approved payments safely
CREATE OR REPLACE FUNCTION process_mercadopago_payment(
    p_order_id UUID,
    p_payment_id TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_order RECORD;
BEGIN
    -- Lock the row to prevent race conditions
    SELECT * INTO v_order FROM public.credit_orders WHERE id = p_order_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    -- Idempotency check: if already approved, ignore
    IF v_order.status = 'approved' THEN
        RETURN FALSE;
    END IF;

    -- 1. Update order status
    UPDATE public.credit_orders
    SET 
        status = 'approved',
        mercadopago_payment_id = p_payment_id,
        paid_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    WHERE id = p_order_id;

    -- 2. Add credits to profile
    UPDATE public.profiles
    SET credits = credits + v_order.credits_amount
    WHERE user_id = v_order.user_id;

    -- 3. Register transaction
    INSERT INTO public.credit_transactions (
        user_id,
        amount,
        type,
        description
    ) VALUES (
        v_order.user_id,
        v_order.credits_amount,
        'compra_mercadopago',
        'Compra de pacote: ' || v_order.pricing_config_id
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
