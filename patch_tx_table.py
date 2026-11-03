import re

file_path = "src/components/admin/TransactionsTable.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace the simple types array with custom logical filters
old_filters = '''  const filtered = txs.filter(t => typeFilter === "all" || t.type === typeFilter);
  const types = Array.from(new Set(txs.map(t => t.type)));'''

new_filters = '''  const filtered = txs.filter(t => {
    if (typeFilter === "all") return true;
    if (typeFilter === "pago") return t.amount > 0 && t.type === "purchase";
    if (typeFilter === "gratis") return t.amount > 0 && t.type !== "purchase";
    if (typeFilter === "gastos") return t.amount < 0;
    return true;
  });'''

content = content.replace(old_filters, new_filters)

# Replace the buttons
old_buttons = '''      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => setTypeFilter("all")} className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border ${typeFilter === "all" ? "bg-primary text-background border-primary" : "border-white/10 text-white/50"}`}>Tudo</button>
        {types.map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-widest border ${typeFilter === t ? "bg-primary text-background border-primary" : "border-white/10 text-white/50"}`}>{t}</button>
        ))}
      </div>'''

new_buttons = '''      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { id: "all", label: "Todas" },
          { id: "pago", label: "Pagos (R$)" },
          { id: "gratis", label: "Grátis / Admin" },
          { id: "gastos", label: "Desbloqueios" }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setTypeFilter(t.id)} 
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border 
              ${typeFilter === t.id 
                ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105" 
                : "bg-black/50 border-white/10 text-white/40 hover:text-white hover:bg-white/5"}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>'''

content = content.replace(old_buttons, new_buttons)

# Also apply the styling to the list items (remove text-primary, bg-secondary)
old_item = '''<span className="text-white/50 text-[10px] uppercase tracking-widest bg-secondary/40 px-2 py-0.5 rounded">{t.type}</span>'''
new_item = '''<span className="text-white/40 text-[10px] uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-1 rounded-lg">{t.type.replace('cost_', 'custo_')}</span>'''
content = content.replace(old_item, new_item)

old_amount = '''<span className={`font-bold w-12 text-right ${t.amount > 0 ? "text-emerald-400" : "text-destructive"}`}>{t.amount > 0 ? "+" : ""}{t.amount}</span>'''
new_amount = '''<span className={`font-bold w-12 text-right text-sm ${t.amount > 0 ? "text-[#10b981]" : "text-amber-500"}`}>{t.amount > 0 ? "+" : ""}{t.amount}</span>'''
content = content.replace(old_amount, new_amount)

old_row = '''<div key={t.id} className="border border-white/10 bg-white/[0.02] rounded-3xl backdrop-blur-md p-3 flex items-center gap-3 text-xs">'''
new_row = '''<div key={t.id} className="border border-white/10 bg-white/[0.02] rounded-2xl backdrop-blur-md p-4 flex items-center gap-4 text-xs hover:bg-white/[0.04] transition-colors">'''
content = content.replace(old_row, new_row)

old_desc = '''<span className="text-white/50/70 truncate w-64 hidden md:block">{t.description}</span>'''
new_desc = '''<span className="text-white/30 truncate flex-1 hidden md:block" title={t.description || ""}>{t.description}</span>'''
content = content.replace(old_desc, new_desc)

with open(file_path, "w") as f:
    f.write(content)

