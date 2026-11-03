import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_body = """                             <div className="flex flex-col gap-1">
                               <p className="font-ps-ui text-sm text-white/90">
                                 <span className="text-[#C9A227] font-bold">📍 Origem:</span> {c.origin} • Destino: Casa {c.goal} <span className="text-white/40 ml-1">(Foco: {displayIntent})</span>
                               </p>
                               {houseData?.tag && (
                                 <p className="text-ps-muted text-[10px] uppercase tracking-widest pl-[6.5rem]">
                                   ↳ TEMA: {houseData.tag}
                                 </p>
                               )}
                             </div>
                           );
                         } else {
                           return (
                             <div className="flex flex-col gap-1">
                               <p className="font-ps-ui text-sm text-white/90">
                                 <span className="text-[#C9A227] font-bold">🎯 Foco:</span> {displayIntent} • Casa {c.goal}
                               </p>
                               {houseData?.tag && (
                                 <p className="text-ps-muted text-[10px] uppercase tracking-widest pl-14">
                                   ↳ TEMA: {houseData.tag}
                                 </p>
                               )}
                             </div>"""

new_body = """                             <div className="flex flex-col gap-1.5">
                               <p className="font-ps-ui text-sm text-white/90">
                                 <span className="text-[#C9A227] font-bold">📍 Origem:</span> {c.origin} • Destino: Casa {c.goal} <span className="text-white/40 ml-1">(Foco: {displayIntent})</span>
                               </p>
                               {houseData?.tag && (
                                 <p className="text-ps-gold/60 text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                                   <div className="w-1 h-1 rounded-full bg-ps-gold/40"></div>
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
                                 <p className="text-ps-gold/60 text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                                   <div className="w-1 h-1 rounded-full bg-ps-gold/40"></div>
                                   O TEMA DA CASA {c.goal}: {houseData.tag}
                                 </p>
                               )}
                             </div>"""

content = content.replace(old_body, new_body)

with open(file_path, "w") as f:
    f.write(content)

