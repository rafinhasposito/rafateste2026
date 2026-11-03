import re

file_path = "src/pages/Admin.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Make Header Apple Style
content = content.replace(
    'className="font-ps-display text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wider mb-2"',
    'className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md"'
)
content = content.replace(
    'className="text-muted-foreground text-sm mb-8"',
    'className="text-white/40 text-lg font-light font-ps-ui mb-10 leading-relaxed max-w-2xl"'
)

# Tabs Apple Style
content = content.replace(
    'className="flex gap-2 mb-6 border-b border-border pb-3"',
    'className="flex gap-3 mb-8 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-md"'
)
old_tab_btn = '''              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === t.id 
                  ? "bg-primary text-background rounded-md" 
                  : "text-muted-foreground hover:text-foreground"
              }`}'''
new_tab_btn = '''              className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${
                activeTab === t.id 
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}'''
content = content.replace(old_tab_btn, new_tab_btn)

with open(file_path, "w") as f:
    f.write(content)


file_path2 = "src/components/admin/PricingEditor.tsx"
with open(file_path2, "r") as f:
    content2 = f.read()

# PricingEditor Apple Style
old_row = '''      <div className="glass-panel p-4 grid grid-cols-12 gap-3 items-center">
        <input
          value={d.label ?? item.label}
          onChange={e => change(item.key, "label", e.target.value)}
          className="col-span-3 px-3 py-2 rounded-lg bg-background/40 border border-border text-foreground text-sm"
        />
        <input
          value={d.description ?? item.description ?? ""}
          onChange={e => change(item.key, "description", e.target.value)}
          placeholder="Descrição"
          className="col-span-5 px-3 py-2 rounded-lg bg-background/40 border border-border text-muted-foreground text-xs"
        />
        <input
          type="number" min={0}
          value={d.credits ?? item.credits}
          onChange={e => change(item.key, "credits", parseInt(e.target.value) || 0)}
          className="col-span-1 px-2 py-2 rounded-lg bg-background/40 border border-border text-primary text-sm text-center font-bold"
          title="Créditos"
        />
        {showPrice ? (
          <input
            type="number" step="0.01" min={0}
            value={d.price_brl ?? item.price_brl ?? ""}
            onChange={e => change(item.key, "price_brl", parseFloat(e.target.value) || null)}
            placeholder="R$"
            className="col-span-2 px-2 py-2 rounded-lg bg-background/40 border border-border text-foreground text-sm text-center"
          />
        ) : <div className="col-span-2 text-center text-muted-foreground text-xs">—</div>}
        <button
          onClick={() => save(item)} disabled={!has || saving === item.key}
          className="col-span-1 py-2 rounded-lg bg-primary text-background text-xs font-bold uppercase disabled:opacity-30"
        >
          {saving === item.key ? "..." : "Salvar"}
        </button>
      </div>'''

new_row = '''      <div className="p-4 grid grid-cols-12 gap-3 items-center rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
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
      </div>'''

content2 = content2.replace(old_row, new_row)

content2 = content2.replace(
    'className="font-ps-display text-sm text-foreground uppercase tracking-widest mb-3"',
    'className="font-ps-display text-xl text-white tracking-widest mb-4"'
)
content2 = content2.replace(
    'className="grid grid-cols-12 gap-3 px-4 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground/60"',
    'className="grid grid-cols-12 gap-3 px-4 mb-3 text-[9px] uppercase tracking-[0.2em] font-bold text-white/40"'
)

with open(file_path2, "w") as f:
    f.write(content2)

