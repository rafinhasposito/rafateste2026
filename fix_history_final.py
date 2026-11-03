import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Restore BackButton
if "import { BackButton }" not in content:
    content = content.replace('import StarryBackground from "@/components/StarryBackground";', 'import StarryBackground from "@/components/StarryBackground";\nimport { BackButton } from "@/components/ui/BackButton";')

old_button = """        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-ps-muted hover:text-ps-text transition-colors mb-8 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Início
        </button>"""
new_button = '<BackButton className="mb-8" label="Descobrir" to="/"/>'

content = content.replace(old_button, new_button)

# 2. Add intentMap outside the component or inside
intent_map_code = """
const intentMap: Record<string, string> = {
  amor: "Amor e Relacionamento",
  trabalho: "Trabalho e Carreira",
  dinheiro: "Dinheiro e Recursos",
  saude: "Saúde e Vitalidade",
  networking: "Networking e Conexões",
  rotina: "Rotina e Produtividade",
  espiritual: "Espiritual e Propósito",
  identidade: "Identidade e Imagem"
};
"""

if "const intentMap" not in content:
    content = content.replace("export default function History() {", intent_map_code + "\nexport default function History() {")

# 3. Update the render logic for intents and origins
old_render_logic = """                    {/* Foco/Intenção Real */}
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      {hasIntent && hasHouse ? (
                        <p className="font-ps-ui text-sm text-ps-text">
                          <span className="text-ps-gold font-bold">🎯 Intenção:</span> {c.intent} • Casa {c.goal}
                        </p>
                      ) : hasIntent ? (
                        <p className="font-ps-ui text-sm text-ps-text">
                          <span className="text-ps-gold font-bold">🎯 Foco:</span> {c.intent}
                        </p>
                      ) : hasHouse ? (
                        <p className="font-ps-ui text-sm text-ps-text">
                          <span className="text-ps-gold font-bold">🎯 Foco:</span> Casa {c.goal}
                        </p>
                      ) : (
                        <p className="font-ps-ui text-sm text-ps-muted">
                          <Search className="inline w-3 h-3 mr-1" /> Análise Completa
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 mb-8">
                      {c.origin && (
                        <p className="flex items-center gap-3 text-ps-muted text-[11px] uppercase tracking-widest">
                          <MapPin className="w-4 h-4 text-white/10" /> 
                          Ponto de Partida: <span className="text-white/60 font-bold">{c.origin}</span>
                        </p>
                      )}"""

new_render_logic = """                    {/* Foco/Intenção Real / Origem */}
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
                    </div>

                    <div className="space-y-3 mb-8">"""

content = content.replace(old_render_logic, new_render_logic)

with open(file_path, "w") as f:
    f.write(content)

