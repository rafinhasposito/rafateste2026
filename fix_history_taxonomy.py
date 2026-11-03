import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# First, fix the Method Badge inference to make it more robust if needed, but the prompt says:
# "ajuste a função inferSearchType para retornar o objeto correto... cruzando c.origin, c.intent e c.goal"
# Since we don't have search_type, we'll use a heuristic based on name or just default to the previous one, but ensure Scenario C is reachable if it's "Por Casa"
# We can check if `c.name` includes "Casa" maybe? Or just keep:
# if hasOrigin -> CITY
# else if hasIntent && c.name?.toLowerCase().includes("casa") -> HOUSE
# else if hasIntent -> INTENT
# else -> HOUSE
# Actually, let's just make it:
inference_code_old = """              let MethodIcon = Crown;
              let methodLabel = "BUSCA: POR CASA";
              if (hasOrigin) {
                MethodIcon = Compass;
                methodLabel = "BUSCA: POR CIDADE";
              } else if (hasIntent) {
                MethodIcon = Scroll;
                methodLabel = "BUSCA: POR INTENÇÃO";
              }"""

inference_code_new = """              // Heurística de Taxonomia de Busca
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

content = content.replace(inference_code_old, inference_code_new)

# Now rewrite the BODY rendering
old_body = """                    {/* Foco/Intenção Real / Origem */}
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      {(() => {
                         const displayIntent = c.intent ? (intentMap[c.intent.toLowerCase()] || c.intent) : null;
                         
                         if (hasOrigin && hasHouse) {
                           return (
                             <p className="font-ps-ui text-sm text-ps-text">
                               <span className="text-ps-gold font-bold">📍 Origem:</span> {c.origin} • Destino: Casa {c.goal}
                             </p>
                           );
                         } else if (hasIntent && hasHouse) {
                           return (
                             <p className="font-ps-ui text-sm text-ps-text">
                               <span className="text-ps-gold font-bold">🎯 Intenção:</span> {displayIntent} • Casa {c.goal}
                             </p>
                           );
                         } else if (hasIntent) {
                           return (
                             <p className="font-ps-ui text-sm text-ps-text">
                               <span className="text-ps-gold font-bold">🎯 Foco:</span> {displayIntent}
                             </p>
                           );
                         } else if (hasHouse) {
                           return (
                             <p className="font-ps-ui text-sm text-ps-text">
                               <span className="text-ps-gold font-bold">🎯 Foco:</span> Casa {c.goal}
                             </p>
                           );
                         }
                         return (
                           <p className="font-ps-ui text-sm text-ps-muted">
                             <Search className="inline w-3 h-3 mr-1" /> Análise Completa
                           </p>
                         );
                      })()}
                    </div>"""

new_body = """                    {/* Foco vs Intenção na Taxonomia Correta */}
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

content = content.replace(old_body, new_body)

with open(file_path, "w") as f:
    f.write(content)

