import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { getMyAffiliateDashboard } from "@/lib/affiliates";

const affiliateCache = new Map<string, { isAffiliate: boolean; code: string | null }>();

export function clearAffiliateCache(userId?: string) {
  if (userId) affiliateCache.delete(userId);
  else affiliateCache.clear();
}

export function useIsAffiliate() {
  const { user } = useAuth();
  const cached = user?.id ? affiliateCache.get(user.id) : undefined;
  const [isAffiliate, setIsAffiliate] = useState<boolean>(cached?.isAffiliate ?? false);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(cached?.code ?? null);
  const [loading, setLoading] = useState<boolean>(Boolean(user?.id) && !cached);

  useEffect(() => {
    let active = true;
    if (!user?.id) {
      setIsAffiliate(false);
      setAffiliateCode(null);
      setLoading(false);
      return;
    }

    const existing = affiliateCache.get(user.id);
    if (existing) {
      setIsAffiliate(existing.isAffiliate);
      setAffiliateCode(existing.code);
      setLoading(false);
      return;
    }

    setLoading(true);
    getMyAffiliateDashboard()
      .then((res) => {
        if (!active) return;
        const flag = Boolean(res.dbReady && res.data?.is_affiliate);
        const code = res.data?.affiliate?.code ?? null;
        if (res.dbReady) {
          affiliateCache.set(user.id, { isAffiliate: flag, code });
        }
        setIsAffiliate(flag);
        setAffiliateCode(code);
      })
      .catch(() => {
        if (!active) return;
        setIsAffiliate(false);
        setAffiliateCode(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  return { isAffiliate, affiliateCode, loading };
}
