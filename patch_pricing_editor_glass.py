import re

file_path = "src/components/admin/PricingEditor.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Row container
content = content.replace(
    'rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors',
    'rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]'
)

# Inputs
content = content.replace(
    'rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors',
    'rounded-2xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all shadow-inner'
)
content = content.replace(
    'rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs focus:outline-none focus:border-white/30 transition-colors',
    'rounded-2xl bg-black/50 border border-white/10 text-white/70 text-xs focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all shadow-inner'
)
content = content.replace(
    'rounded-xl bg-white/5 border border-white/10 text-white text-sm text-center font-bold focus:outline-none focus:border-white/30 transition-colors',
    'rounded-2xl bg-black/50 border border-white/10 text-white text-sm text-center font-bold focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all shadow-inner'
)
content = content.replace(
    'rounded-xl bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-white/30 transition-colors',
    'rounded-2xl bg-black/50 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all shadow-inner'
)

# Save Button
content = content.replace(
    'py-3 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:scale-105 active:scale-95 transition-all',
    'py-3 rounded-2xl bg-white text-black text-[10px] font-bold uppercase tracking-widest disabled:opacity-20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300'
)

with open(file_path, "w") as f:
    f.write(content)

