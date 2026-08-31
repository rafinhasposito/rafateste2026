import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TEST_MODE } from "@/lib/testMode";

export const useIsAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(TEST_MODE);
  const [loading, setLoading] = useState(!TEST_MODE);

  useEffect(() => {
    if (TEST_MODE) return;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
        
      if (!cancelled) {
        // Força a liberação de admin para o seu e-mail, ignorando qualquer bloqueio
        const isMyEmail = user.email === "divulgacaoareavip@gmail.com";
        setIsAdmin(!!data || isMyEmail);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  return { isAdmin, loading };
};
