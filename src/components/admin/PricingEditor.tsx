import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePricing, type PricingItem } from "@/hooks/usePricing";
import { toast } from "sonner";
import { Package, Zap, CreditCard, Coins } from "lucide-react";

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

  if (loading) return <div className="animate-pulse text-white/50">Carregando arquitetura...</div>;

  const packages = items.filter(i => i.category === "package");
  const costs = items.filter(i => i.category === "cost");

  const Card = ({ item, isPackage }: { item: PricingItem; isPackage: boolean }) => {
    const d = draft[item.key] || {};
    const has = Object.keys(d).length > 0;
    
    return (
      <div className="relative group p-6 rounded-[32px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {/* Glow de Fundo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-[60px] pointer-events-none transition-all duration-700 group-hover:bg-white/10"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
              {isPackage ? <Package className="w-5 h-5 text-white/70" /> : <Zap className="w-5 h-5 text-white/70" />}
            </div>
            <input
              value={d.label ?? item.label}
              onChange={e => change(item.key, "label", e.target.value)}
              className="w-full bg-transparent border-b border-transparent focus:border-white/30 text-white font-ps-display text-2xl font-bold tracking-tight focus:outline-none transition-colors placeholder:text-white/20"
              placeholder="Nome"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 ml-1">Descrição</label>
            <textarea
              value={d.description ?? item.description ?? ""}
              onChange={e => change(item.key, "description", e.target.value)}
              className="w-full h-20 p-3 rounded-2xl bg-black/40 border border-white/10 text-white/70 text-sm focus:outline-none focus:border-white/30 focus:bg-black/60 transition-all resize-none shadow-inner"
              placeholder="Descreva este item..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 ml-1 flex items-center gap-1"><Coins className="w-3 h-3"/> Créditos</label>
              <input
                type="number" min={0}
                value={d.credits ?? item.credits}
                onChange={e => change(item.key, "credits", parseInt(e.target.value) || 0)}
                className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-white font-bold text-center focus:outline-none focus:border-white/30 focus:bg-black/60 transition-all shadow-inner"
              />
            </div>
            
            {isPackage ? (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 ml-1 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Preço (R$)</label>
                <input
                  type="number" step="0.01" min={0}
                  value={d.price_brl ?? item.price_brl ?? ""}
                  onChange={e => change(item.key, "price_brl", parseFloat(e.target.value) || null)}
                  className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-white font-bold text-center focus:outline-none focus:border-white/30 focus:bg-black/60 transition-all shadow-inner"
                />
              </div>
            ) : (
              <div className="space-y-1.5 opacity-30">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 ml-1 flex items-center gap-1"><CreditCard className="w-3 h-3"/> Preço (R$)</label>
                <div className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-white/30 font-bold text-center cursor-not-allowed">—</div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => save(item)} disabled={!has || saving === item.key}
          className="relative z-10 w-full mt-6 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest disabled:opacity-20 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300"
        >
          {saving === item.key ? "Sincronizando..." : "Salvar Alterações"}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-16">
      <section>
        <div className="mb-8 border-b border-white/10 pb-6">
          <h3 className="font-ps-display text-3xl text-white tracking-tight font-bold mb-2">Pacotes de Compra</h3>
          <p className="text-white/40 text-sm font-ps-ui">Defina os valores em Reais (R$) que os usuários pagarão no Checkout.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {packages.map(i => <Card key={i.key} item={i} isPackage={true} />)}
        </div>
      </section>

      <section>
        <div className="mb-8 border-b border-white/10 pb-6">
          <h3 className="font-ps-display text-3xl text-white tracking-tight font-bold mb-2">Custos por Ação</h3>
          <p className="text-white/40 text-sm font-ps-ui">Defina quantos Créditos cada ação custa dentro do aplicativo.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {costs.map(i => <Card key={i.key} item={i} isPackage={false} />)}
        </div>
      </section>
    </div>
  );
};

export default PricingEditor;
