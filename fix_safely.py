import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Add houseThemes import
content = content.replace(
    'import { BASE_HOUSE_PROFILES } from "@/data/baseHouseProfiles";',
    'import { BASE_HOUSE_PROFILES } from "@/data/baseHouseProfiles";\nimport { houseThemes } from "@/data/houseThemes";'
)

# 2. Add houseColor dynamic variable
content = content.replace(
    '  };\n  \n  const getHeroVideo',
    '  };\n  \n  // Cor dinâmica da Casa\n  const houseColor = houseThemes[P_DYNAMIC.house]?.themeColor || "#10b981";\n  \n  const getHeroVideo'
)

# 3. Fix font clipping
content = content.replace(
    'leading-[0.8] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#10b981] to-emerald-200',
    'leading-[1] mb-8 pt-2 text-transparent bg-clip-text'
)
# And replace the motion.h2 color injection
content = content.replace(
    'style={{ scale: textScale, opacity: textOpacity, filter: textBlur }}',
    'style={{ scale: textScale, opacity: textOpacity, filter: textBlur, color: houseColor, backgroundImage: `linear-gradient(to bottom, ${houseColor}, #a7f3d0)` }}'
)

# 4. Add missing cities to getHouseImageUrl
old_cities = """    if (norm.includes("londres")) return "https://images.unsplash.com/photo-1513635269975-59693e2d8400?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("bali")) return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80";"""
new_cities = """    if (norm.includes("londres") || norm.includes("london")) return "https://images.unsplash.com/photo-1513635269975-59693e2d8400?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("bali")) return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("sao paulo") || norm.includes("são paulo")) return "https://images.unsplash.com/photo-1470160710819-b3bd5ec85c66?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("rio de janeiro")) return "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("jerusalem") || norm.includes("jerusale")) return "https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&w=2000&q=80";
    if (norm.includes("berlim") || norm.includes("berlin")) return "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=2000&q=80";"""
content = content.replace(old_cities, new_cities)

# 5. Fix empty state in routes
old_empty = """                      <div className="bg-black/40 border border-white/5 rounded-[28px] h-56 flex flex-col items-center justify-center p-6 text-center">
                         <MapPin className="w-6 h-6 text-white/20 mb-3" />
                         <span className="font-sans text-xs uppercase tracking-widest text-white/40 font-bold mb-1">Rota Indisponível</span>
                         <span className="text-white/20 text-[10px]">A API não retornou destino para este tier.</span>
                      </div>"""
new_empty = """                      <div className="border border-dashed border-white/10 rounded-[28px] h-56 flex flex-col items-center justify-center p-6 text-center bg-white/[0.02] backdrop-blur-sm">
                         <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4">
                           <Lock className="w-5 h-5 text-white/20" />
                         </div>
                         <span className="font-ps-display text-sm font-bold text-white/50 mb-1">Em breve</span>
                         <span className="text-white/25 text-[10px] leading-relaxed max-w-[200px]">Nosso sistema está calculando a melhor rota para o seu perfil.</span>
                      </div>"""
content = content.replace(old_empty, new_empty)

# 6. Fix Foco em Dinheiro
content = content.replace('Foco em {P.intention}', 'Foco em {currentActiveData?.label?.split(" ")[0] || P.intention}')
content = content.replace('useState<string | null>("dinheiro")', 'useState<string | null>(null)')

# 7. Boarding Pass "Dinheiro & Prosperidade"
content = content.replace('Dinheiro & Prosperidade\n', '{currentActiveData?.label || "Dinheiro & Prosperidade"}\n')

# 8. Apply global colors safely by injecting CSS custom props to the main container 
content = content.replace(
    'style={{ backgroundColor: `color-mix(in srgb, ${currentActiveData?.color || \'#10b981\'} 6%, #03100B)` }}',
    'style={{ backgroundColor: `color-mix(in srgb, ${houseColor} 6%, #03100B)`, "--hc": houseColor, "--hc10": `${houseColor}1a`, "--hc15": `${houseColor}26`, "--hc20": `${houseColor}33`, "--hc30": `${houseColor}4d`, "--hc40": `${houseColor}66`, "--hc70": `${houseColor}b3` } as React.CSSProperties}'
)

# Replace all #10b981 with var(--hc) in classNames inside the Boarding Pass (and similar structured elements)
# Using regex to replace Tailwind arbitrary values
content = re.sub(r'text-\[#10b981\](?:/(\d+))?', lambda m: f"text-[var(--hc{m.group(1) or ''})]", content)
content = re.sub(r'bg-\[#10b981\](?:/(\d+))?', lambda m: f"bg-[var(--hc{m.group(1) or ''})]", content)
content = re.sub(r'border-\[#10b981\](?:/(\d+))?', lambda m: f"border-[var(--hc{m.group(1) or ''})]", content)

# Fix the specific boarding pass header bg text
content = content.replace('bg-gradient-to-r from-[#10b981] to-emerald-300', 'bg-gradient-to-r from-[var(--hc)] to-white/50')

# Fix style block literal #10b981 in Boarding Pass icon
content = content.replace('color: \'#10b981\'', 'color: houseColor')
content = content.replace('shadow-[0_0_10px_#10b981]', 'shadow-[0_0_10px_var(--hc)]')
content = content.replace('shadow-[0_30px_80px_rgba(16,185,129,0.15)]', 'shadow-[0_30px_80px_var(--hc15)]')
content = content.replace('shadow-[0_0_30px_rgba(16,185,129,0.2)]', 'shadow-[0_0_30px_var(--hc20)]')


with open(file_path, "w") as f:
    f.write(content)
print("Safely updated!")
