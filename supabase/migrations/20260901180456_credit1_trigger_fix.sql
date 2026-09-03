-- CREDIT1 CORRECTIVE MIGRATION
-- Fixes the prevent_direct_credits_update trigger to use current_user IN ('authenticated', 'anon')
-- instead of current_setting('role') to allow SECURITY DEFINER RPCs to bypass the restriction.

CREATE OR REPLACE FUNCTION public.prevent_direct_credits_update()
RETURNS trigger AS $$
BEGIN
    IF current_user IN ('authenticated', 'anon') THEN
        IF NEW.credits IS DISTINCT FROM OLD.credits THEN
            RAISE EXCEPTION 'Direct updates to credits column are not allowed via API.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
