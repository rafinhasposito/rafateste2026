import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Update the Search Method inference logic (Badge logic)
old_inference = """              // Heurística de Taxonomia de Busca
              let searchMethod = "house";
              if (hasOrigin) {
                searchMethod = "city";
              } else if (hasIntent && c.name?.toLowerCase().includes("casa")) {
                searchMethod = "house"; // Se tem intenção mas o nome diz "Casa", ele entrou por Casa.
              } else if (hasIntent) {
                searchMethod = "intent";
              }
              
              let MethodIcon = Crown;
              let methodLabel = "BUSCA: POR CASA";
              if (searchMethod === "city") {
                MethodIcon = Compass;
                methodLabel = "BUSCA: POR CIDADE";
              } else if (searchMethod === "intent") {
                MethodIcon = Scroll;
                methodLabel = "BUSCA: POR INTENÇÃO";
              }"""

new_inference = """              // A Lógica da Badge de Topo (Método de Busca)
              let MethodIcon = Crown;
              let methodLabel = "BUSCA: POR CASA";
              if (hasOrigin) {
                MethodIcon = Compass;
                methodLabel = "BUSCA: POR CIDADE";
              }"""

content = content.replace(old_inference, new_inference)

# 2. Update the body rendering to REMOVE the word "Intenção" and use exactly what the prompt requires.
old_body = """                    {/* Foco vs Intenção na Taxonomia Correta */}
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      {(() => {
                         const displayIntent = c.intent ? (intentMap[c.intent.toLowerCase()] || c.intent) : "Análise Geral";
                         
                         if (searchMethod === "city") {
                           return (
                             <p className="font-ps-ui text-sm text-ps-text">
                               <span className="text-ps-gold font-bold">📍 Origem:</span> {c.origin} • Destino: Casa {c.goal} <span className="text-white/40">(Foco: {displayIntent})</span>
                             </p>
                           );
                         } else if (searchMethod === "intent") {
                           return (
                             <p className="font-ps-ui text-sm text-ps-text">
                               <span className="text-ps-gold font-bold">🎯 Intenção:</span> {displayIntent} • Casa {c.goal}
                             </p>
                           );
                         } else {
                           // searchMethod === "house"
                           return (
                             <p className="font-ps-ui text-sm text-ps-text">
                               <span className="text-ps-gold font-bold">🎯 Foco:</span> {displayIntent} • Casa {c.goal}
                             </p>
                           );
                         }
                      })()}
                    </div>"""

new_body = """                    {/* Renderização de Foco e Origem */}
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      {(() => {
                         const displayIntent = c.intent ? (intentMap[c.intent.toLowerCase()] || c.intent) : "Análise Geral";
                         
                         if (hasOrigin) {
                           return (
                             <p className="font-ps-ui text-sm text-white/90">
                               <span className="text-[#C9A227] font-bold">📍 Origem:</span> {c.origin} • Destino: Casa {c.goal} <span className="text-white/40 ml-1">(Foco: {displayIntent})</span>
                             </p>
                           );
                         } else {
                           return (
                             <p className="font-ps-ui text-sm text-white/90">
                               <span className="text-[#C9A227] font-bold">🎯 Foco:</span> {displayIntent} • Casa {c.goal}
                             </p>
                           );
                         }
                      })()}
                    </div>"""

content = content.replace(old_body, new_body)

with open(file_path, "w") as f:
    f.write(content)

