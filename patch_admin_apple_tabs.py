import re

file_path = "src/pages/Admin.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_tab_btn = 'className={`px-4 py-2 rounded-t-lg text-xs uppercase tracking-widest font-semibold transition-all ${tab === t.id ? "bg-primary text-background" : "text-muted-foreground hover:text-foreground"}`}>'

new_tab_btn = 'className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${tab === t.id ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "text-white/50 hover:text-white hover:bg-white/5"}`}>'

content = content.replace(old_tab_btn, new_tab_btn)

with open(file_path, "w") as f:
    f.write(content)

