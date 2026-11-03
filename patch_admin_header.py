import re

file_path = "src/pages/Admin.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Update header typography and tab buttons
content = content.replace(
    '<div className="flex gap-3 mb-8 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-md">',
    '<div className="flex flex-wrap gap-3 mb-12 p-2 bg-black/40 border border-white/10 rounded-3xl w-fit backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">'
)

content = content.replace(
    'className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 rounded-xl ${tab === t.id ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "text-white/50 hover:text-white hover:bg-white/5"}`}>',
    'className={`px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 rounded-2xl ${tab === t.id ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105" : "text-white/40 hover:text-white hover:bg-white/5"}`}>'
)

with open(file_path, "w") as f:
    f.write(content)

