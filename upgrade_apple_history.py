import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add ChevronRight to lucide imports
if "ChevronRight" not in content:
    content = content.replace("ArrowLeft, Clock, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint, MapPin, Search, Compass, Scroll, Crown", "ArrowLeft, Clock, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint, MapPin, Search, Compass, Scroll, Crown, ChevronRight")

# Remove Acessar button and add ChevronRight, make entire card clickable
old_card_start = """              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`group bg-ps-surface border border-white/5 ${hoverStyles.border} rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between`}
                >"""

new_card_start = """              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onClick={() => navigate(`/dashboard?id=${c.id}`)}
                  className={`group bg-ps-surface border border-white/5 ${hoverStyles.border} rounded-3xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1 cursor-pointer relative overflow-hidden flex flex-col justify-between`}
                >"""
content = content.replace(old_card_start, new_card_start)

# Simplify ID and Date, remove inner border, adjust typography
old_body_content = """                    <div className="mb-2 text-white/30 font-mono text-[10px] uppercase tracking-widest">
                      ID: {shortId} • DOSSIÊ ASTROLÓGICO
                    </div>

                    <h3 className="font-ps-display text-2xl md:text-3xl text-ps-champagne mb-4 group-hover:text-white transition-colors duration-300 line-clamp-1">
                      {c.name || "Dossiê Desconhecido"}
                    </h3>

                    {/* Renderização de Foco e Origem */}
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      {(() => {
                         const displayIntent = c.intent ? (intentMap[c.intent.toLowerCase()] || c.intent) : "Análise Geral";
                         
                         if (hasOrigin) {
                           return (
                             <div className="flex flex-col gap-1.5">
                               <p className="font-ps-ui text-sm text-white/90">
                                 <span className="text-[#C9A227] font-bold">📍 Origem:</span> {c.origin} • Destino: Casa {c.goal} <span className="text-white/40 ml-1">(Foco: {displayIntent})</span>
                               </p>
                               {houseData?.tag && (
                                 <p className="text-[#C9A227]/60 text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                                   <span className="w-1 h-1 rounded-full bg-[#C9A227]/40 inline-block"></span>
                                   O TEMA DA CASA {c.goal}: {houseData.tag}
                                 </p>
                               )}
                             </div>
                           );
                         } else {
                           return (
                             <div className="flex flex-col gap-1.5">
                               <p className="font-ps-ui text-sm text-white/90">
                                 <span className="text-[#C9A227] font-bold">🎯 Foco:</span> {displayIntent} • Casa {c.goal}
                               </p>
                               {houseData?.tag && (
                                 <p className="text-[#C9A227]/60 text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                                   <span className="w-1 h-1 rounded-full bg-[#C9A227]/40 inline-block"></span>
                                   O TEMA DA CASA {c.goal}: {houseData.tag}
                                 </p>
                               )}
                             </div>
                           );
                         }
                      })()}
                    </div>

                    <div className="space-y-3 mb-8">
                      {c.origin && (
                        <p className="flex items-center gap-3 text-ps-muted text-[11px] uppercase tracking-widest">
                          <MapPin className="w-4 h-4 text-white/10" /> 
                          Ponto de Partida: <span className="text-white/60 font-bold">{c.origin}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-3 text-ps-muted text-[11px] uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-white/10" /> 
                        Data da Consulta: <span className="text-white/60">{formatDate(c.created_at)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-ps-muted text-[9px] uppercase tracking-[0.2em] block mb-1">Status</span>
                      <span className="text-ps-gold text-sm font-ps-ui flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-ps-gold rounded-full animate-pulse"></div> Ativo e Sincronizado</span>
                    </div>

                    <button 
                      onClick={() => navigate(`/dashboard?id=${c.id}`)}
                      className="shrink-0 px-6 h-12 rounded-full bg-white/5 border border-white/10 text-ps-champagne flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-ps-gold hover:border-ps-gold hover:text-ps-void transition-all duration-300 group-hover:scale-105"
                    >
                      Acessar <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>"""

new_body_content = """                    <div className="mb-1 text-white/30 font-mono text-[10px] uppercase tracking-widest">
                      #{shortId} • DOSSIÊ
                    </div>

                    <h3 className="font-ps-display text-2xl md:text-3xl text-ps-champagne mb-5 group-hover:text-white transition-colors duration-300 line-clamp-1">
                      {c.name || "Dossiê Desconhecido"}
                    </h3>

                    {/* Renderização Apple-Style (Sem bordas duras, focada no conteúdo) */}
                    <div className="mb-6">
                      {(() => {
                         const displayIntent = c.intent ? (intentMap[c.intent.toLowerCase()] || c.intent) : "Análise Geral";
                         
                         if (hasOrigin) {
                           return (
                             <div className="flex flex-col gap-1">
                               <p className="font-ps-ui text-[15px] text-white/90">
                                 <span className="text-ps-muted">Origem:</span> {c.origin} <span className="text-white/20 mx-1">/</span> Destino: Casa {c.goal}
                               </p>
                               <p className="font-ps-ui text-[15px] text-white/90">
                                 <span className="text-ps-muted">Foco Principal:</span> {displayIntent}
                               </p>
                               {houseData?.tag && (
                                 <p className="text-[#C9A227]/70 text-xs font-ps-ui mt-2 flex items-center gap-2">
                                   <span className="w-1 h-1 rounded-full bg-[#C9A227]/50 inline-block"></span>
                                   Tema da Casa: {houseData.tag}
                                 </p>
                               )}
                             </div>
                           );
                         } else {
                           return (
                             <div className="flex flex-col gap-1">
                               <p className="font-ps-ui text-[15px] text-white/90">
                                 <span className="text-ps-muted">Foco Principal:</span> {displayIntent} <span className="text-white/20 mx-1">/</span> Casa {c.goal}
                               </p>
                               {houseData?.tag && (
                                 <p className="text-[#C9A227]/70 text-xs font-ps-ui mt-2 flex items-center gap-2">
                                   <span className="w-1 h-1 rounded-full bg-[#C9A227]/50 inline-block"></span>
                                   Tema da Casa: {houseData.tag}
                                 </p>
                               )}
                             </div>
                           );
                         }
                      })()}
                    </div>

                    <div className="flex items-center gap-4 text-ps-muted text-xs font-ps-ui mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 opacity-50" /> 
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/40 text-xs font-ps-ui">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> 
                      Sincronizado
                    </div>

                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-ps-gold group-hover:text-ps-void transition-all duration-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>"""

content = content.replace(old_body_content, new_body_content)

with open(file_path, "w") as f:
    f.write(content)

