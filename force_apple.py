import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace button
if "Acessar <ArrowUpRight className=\"w-4 h-4\" />" in content:
    print("Found button, replacing...")
    button_regex = re.compile(r'<button[^>]*>[\s\S]*?Acessar <ArrowUpRight className="w-4 h-4" />[\s\S]*?</button>')
    content = button_regex.sub("""<div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-ps-gold group-hover:text-ps-void transition-all duration-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>""", content)

# Replace the inner box border
if "bg-white/[0.02] border border-white/[0.05]" in content:
    print("Found inner box, replacing...")
    content = content.replace("bg-white/[0.02] border border-white/[0.05]", "")

# Replace "DATA DA CONSULTA:"
if "Data da Consulta:" in content:
    print("Found data da consulta, replacing...")
    content = content.replace('Data da Consulta: <span className="text-white/60">{formatDate(c.created_at)}</span>', '<span className="text-white/60">{formatDate(c.created_at)}</span>')

# Replace Status Ativo e Sincronizado
if "Ativo e Sincronizado" in content:
    print("Found status, replacing...")
    content = content.replace('<span className="text-ps-gold text-sm font-ps-ui flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-ps-gold rounded-full animate-pulse"></div> Ativo e Sincronizado</span>', '<span className="text-white/40 text-xs font-ps-ui flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Sincronizado</span>')

# Make the card clickable
if 'className={`group bg-ps-surface' in content and 'onClick={() => navigate' not in content:
    print("Found card div, replacing...")
    content = content.replace('className={`group bg-ps-surface', 'onClick={() => navigate(`/dashboard?id=${c.id}`)}\n                  className={`cursor-pointer group bg-ps-surface')

# Add ChevronRight import
if "ChevronRight" not in content:
    content = content.replace("ArrowLeft, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint", "ArrowLeft, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint, ChevronRight")

with open(file_path, "w") as f:
    f.write(content)

