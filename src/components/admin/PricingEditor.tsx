import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePricing, type PricingItem } from "@/hooks/usePricing";
import { toast } from "sonner";

const PricingEditor = () => {
  const { items, loading, refresh } = usePricing();
  const [draft, setDraft] = useState<Record<string, Partial<PricingItem>>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const change = (key: string, field: keyof PricingItem, value: any) => {
    setDraft(d => ({ ...d, [key]: { ...d[key], [field]: value } }));
  };

  const save = async (item: PricingItem) => {
    setSaving(item.key);
    const patch = draft[item.key];
    if (!patch) { setSaving(null); return; }
    const { error } = await supabase.from("pricing_config").update(patch).eq("key", item.key);
    setSaving(null);
    if (error) { toast.error(error.message); return; }
    toast.success(`${item.label} atualizado`);
    setDraft(d => { const { [item.key]: _, ...rest } = d; return rest; });
    refresh();
  };

  if (loading) return <p className="text-muted-foreground text-sm">Carregando…</p>;

  const packages = items.filter(i => i.category === "package");
  const costs = items.filter(i => i.category === "cost");

  const Row = ({ item, showPrice }: { item: PricingItem; showPrice: boolean }) => {
    const d = draft[item.key] || {};
    const has = Object.keys(d).length > 0;
    return (
      <div className="p-4 grid grid-cols-12 gap-3 items-center rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
        <input
          value={d.label ?? item.label}
          onChange={e => change(item.key, "label", e.target.value)}
          className="col-span-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors"
        />
        <input
          value={d.description ?? item.description ?? ""}
          onChange={e => change(item.key, "description", e.target.value)}
          placeholder="Descrição"
          className="col-span-5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs focus:outline-none focus:border-white/30 transition-colors"
        />
        <input
          type="number" min={0}
          value={d.credits ?? item.credits}
          onChange={e => change(item.key, "credits", parseInt(e.target.value) || 0)}
          className="col-span-1 px-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm text-center font-bold focus:outline-none focus:border-white/30 transition-colors"
          title="Créditos"
        />
        {showPrice ? (
          <input
            type="number" step="0.01" min={0}
            value={d.price_brl ?? item.price_brl ?? ""}
            onChange={e => change(item.key, "price_brl", parseFloat(e.target.value) || null)}
            placeholder="R$"
            className="col-span-2 px-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-white/30 transition-colors"
          />
        ) : <div className="col-span-2 text-center text-white/30 text-xs">—</div>}
        <button
          onClick={() => save(item)} disabled={!has || saving === item.key}
          className="col-span-1 py-3 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:scale-105 active:scale-95 transition-all"
        >
          {saving === item.key ? "..." : "Salvar"}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-ps-display text-xl text-white tracking-widest mb-4">Pacotes de Compra</h3>
        <div className="grid grid-cols-12 gap-3 px-4 mb-3 text-[9px] uppercase tracking-[0.2em] font-bold text-white/40">
          <span className="col-span-3">Nome</span><span className="col-span-5">Descrição</span>
          <span className="col-span-1 text-center">Cr</span><span className="col-span-2 text-center">Preço R$</span><span className="col-span-1" />
        </div>
        <div className="space-y-2">{packages.map(i => <Row key={i.key} item={i} showPrice />)}</div>
      </section>
      <section>
        <h3 className="font-ps-display text-xl text-white tracking-widest mb-4">Custos por Ação</h3>
        <div className="grid grid-cols-12 gap-3 px-4 mb-3 text-[9px] uppercase tracking-[0.2em] font-bold text-white/40">
          <span className="col-span-3">Nome</span><span className="col-span-5">Descrição</span>
          <span className="col-span-1 text-center">Cr</span><span className="col-span-2 text-center">Preço</span><span className="col-span-1" />
        </div>
        <div className="space-y-2">{costs.map(i => <Row key={i.key} item={i} showPrice={false} />)}</div>
      </section>
    </div>
  );
};

export default PricingEditor;
