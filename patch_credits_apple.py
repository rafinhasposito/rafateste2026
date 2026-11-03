import re

file_path = "src/pages/Credits.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Apple Header Update
content = content.replace(
    'className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-widest"',
    'className="font-ps-display text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-xl leading-none"'
)
content = content.replace(
    'className="text-white/50 text-sm font-ps-ui max-w-lg mx-auto"',
    'className="text-white/40 text-lg md:text-xl font-light font-ps-ui max-w-2xl mx-auto leading-relaxed"'
)
content = content.replace(
    'text-white/40 text-[10px] uppercase tracking-widest font-sans mb-2',
    'text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold mb-3'
)
content = content.replace(
    'text-[#C9A227] font-ps-display text-5xl font-bold leading-none',
    'text-white font-ps-display text-7xl font-bold leading-none drop-shadow-md'
)

# Loader Update
content = content.replace(
    'className="text-white/60 font-sans text-xs uppercase tracking-widest"',
    'className="text-white/40 font-sans text-[10px] uppercase tracking-[0.2em] font-bold"'
)

# Grid Layout
content = content.replace(
    'className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto"',
    'className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto items-stretch"'
)

# Card Design
old_card_class = '''              className={`p-8 md:p-10 text-center relative transition-all duration-300 flex flex-col justify-between ${
                highlight
                  ? "border border-[#C9A227]/50 bg-[#C9A227]/5 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
                  : "border border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}'''
new_card_class = '''              className={`p-8 md:p-10 text-center relative transition-all duration-500 flex flex-col justify-between rounded-3xl ${
                highlight
                  ? "border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_0_60px_rgba(255,255,255,0.05)] scale-105 z-10"
                  : "border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05]"
              }`}'''
content = content.replace(old_card_class, new_card_class)

# Labels
content = content.replace(
    'text-[10px] font-sans font-bold uppercase tracking-[0.3em] ${highlight ? \'text-[#C9A227]\' : \'text-white/40\'}',
    'text-[9px] font-bold uppercase tracking-[0.4em] ${highlight ? \'text-white/80\' : \'text-white/30\'}'
)

# Package Title
content = content.replace(
    'font-ps-display text-2xl font-bold uppercase tracking-wider mb-3 ${highlight ? \'text-white\' : \'text-white/80\'}',
    'font-ps-display text-3xl font-bold tracking-tight mb-4 ${highlight ? \'text-white drop-shadow-md\' : \'text-white/80\'}'
)

# Package Description
content = content.replace(
    'text-white/50 text-xs font-ps-ui mb-8 min-h-[3rem] leading-relaxed',
    'text-white/40 text-sm font-light font-ps-ui mb-8 min-h-[3rem] leading-relaxed'
)

# Price
content = content.replace(
    'className="mb-6 flex items-start justify-center text-white"',
    'className="mb-8 flex items-start justify-center text-white drop-shadow-lg"'
)
content = content.replace(
    'className="text-white/50 text-sm mt-1 mr-1">R$',
    'className="text-white/30 text-sm font-bold mt-2 mr-1">R$'
)
content = content.replace(
    'className="font-ps-display text-5xl font-bold leading-none"',
    'className="font-ps-display text-7xl font-bold leading-none tracking-tighter"'
)

# Included Credits
content = content.replace(
    'className="mb-8 text-[10px] text-white/40 font-sans uppercase tracking-widest font-bold"',
    'className="mb-10 text-[10px] text-white/40 font-sans uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2"'
)

# Buttons
old_btn = '''              <button
                onClick={() => handlePurchase(pkg)}
                className={`w-full py-4 text-[10px] font-sans uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all ${
                  highlight
                    ? "bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                    : "bg-transparent border border-white/30 text-white hover:bg-white hover:text-black disabled:opacity-50"
                }`}
                disabled={busyPkg === pkg.key}
              >
                {busyPkg === pkg.key ? "Redirecionando..." : "Adquirir Acesso"}
              </button>'''
new_btn = '''              <button
                onClick={() => handlePurchase(pkg)}
                className={`w-full py-5 text-[10px] font-sans uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-3 transition-all duration-300 rounded-2xl ${
                  highlight
                    ? "bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black active:scale-95 disabled:opacity-50"
                }`}
                disabled={busyPkg === pkg.key}
              >
                <CreditCard className="w-4 h-4" />
                {busyPkg === pkg.key ? "Redirecionando..." : "Autorizar Acesso"}
              </button>'''
content = content.replace(old_btn, new_btn)

# Bottom Tabela de Conversão
content = content.replace(
    'className="font-ps-display text-xl text-white uppercase tracking-widest mb-10 text-center"',
    'className="font-ps-display text-2xl text-white/80 font-light tracking-widest mb-12 text-center"'
)

old_table_card = '''                <div key={item.key} className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="font-ps-display text-base text-white mb-2">{item.label}</p>
                  <p className="text-[#C9A227] font-sans text-xs uppercase tracking-widest font-bold mb-2">{item.credits} crédito{item.credits > 1 ? "s" : ""}</p>
                  <p className="text-white/40 text-[10px] font-ps-ui leading-relaxed">{item.description}</p>
                </div>'''
new_table_card = '''                <div key={item.key} className="p-8 text-center rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors duration-500">
                  <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-5 h-5 text-white/50" />
                  </div>
                  <p className="font-ps-display text-lg font-bold text-white mb-2">{item.label}</p>
                  <p className="text-white/60 font-sans text-[10px] uppercase tracking-[0.2em] font-bold mb-4">{item.credits} crédito{item.credits > 1 ? "s" : ""}</p>
                  <p className="text-white/30 text-[11px] font-ps-ui font-light leading-relaxed">{item.description}</p>
                </div>'''
content = content.replace(old_table_card, new_table_card)

with open(file_path, "w") as f:
    f.write(content)

