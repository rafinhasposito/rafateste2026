import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PricingItem {
  key: string;
  category: "package" | "cost" | string;
  label: string;
  description: string | null;
  credits: number;
  price_brl: number | null;
  active: boolean;
  sort_order: number;
}

export const usePricing = () => {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("pricing_config")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    if (data) setItems(data as PricingItem[]);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const getCost = (key: string, fallback: number): number => {
    const i = items.find(x => x.key === key);
    return i?.credits ?? fallback;
  };

  const packages = items.filter(i => i.category === "package" && (i.active ?? true));
  const costs = items.filter(i => i.category === "cost" && (i.active ?? true));

  return { items, packages, costs, loading, refresh, getCost };
};
