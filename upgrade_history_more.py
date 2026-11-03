import re

file_path = "src/pages/History.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add import
if "import { cityDatabase }" not in content:
    content = content.replace('import StarryBackground from "@/components/StarryBackground";', 'import StarryBackground from "@/components/StarryBackground";\nimport { cityDatabase } from "@/data/houses";')

# Inject the logic to get houseData
if "const shortId = c.id.substring(0, 8);" in content:
    content = content.replace("const shortId = c.id.substring(0, 8);", "const shortId = c.id.substring(0, 8);\n              const houseData = c.goal ? cityDatabase[c.goal] : null;")

# Update the body to include the new tag underneath
old_body = """                         if (hasOrigin) {
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
                         }"""

new_body = """                         if (hasOrigin) {
                           return (
                             <div className="flex flex-col gap-1">
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
                             </div>
                           );
                         }"""

content = content.replace(old_body, new_body)

with open(file_path, "w") as f:
    f.write(content)

