import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace Origem
old_origem = '<span className="text-[#C9A227] font-bold">📍 Origem:</span> {c.origin} • Destino: Casa {c.goal} <span className="text-white/40 ml-1">(Foco: {displayIntent})</span>'
new_origem = '<span className="text-ps-muted">Origem:</span> {c.origin} <span className="text-white/20 mx-1">/</span> Destino: Casa {c.goal} <span className="text-white/40 ml-1">({displayIntent})</span>'
content = content.replace(old_origem, new_origem)

# Replace Foco
old_foco = '<span className="text-[#C9A227] font-bold">🎯 Foco:</span> {displayIntent} • Casa {c.goal}'
new_foco = '<span className="text-ps-muted">Foco Principal:</span> {displayIntent} <span className="text-white/20 mx-1">/</span> Casa {c.goal}'
content = content.replace(old_foco, new_foco)

with open(file_path, "w") as f:
    f.write(content)

