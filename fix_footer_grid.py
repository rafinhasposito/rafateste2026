import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix the paragraph text above the grid
old_p = """                <p className="text-white/50 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                  Você desbloqueou a Rota principal para a <strong className="text-white font-medium">{P_DYNAMIC.houseLabel}</strong>. Descubra quais cidades do mundo ativam a sua saúde, seu amor e as outras 11 dimensões da sua vida.
                </p>"""
new_p = """                <p className="text-white/50 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                  Você desbloqueou a Rota principal para: <strong className="text-white font-medium">{cityDatabase[P_DYNAMIC.house as keyof typeof cityDatabase]?.name?.split('—')[1]?.trim() || P_DYNAMIC.houseLabel}</strong>. Descubra quais cidades do mundo ativam a sua saúde, seu amor e as outras 11 dimensões da sua vida.
                </p>"""
content = content.replace(old_p, new_p)


# Fix areaColor to use houseThemes
old_color = "const areaColor = LIFE_AREAS[num - 1]?.color || currentActiveData?.color || '#10b981';"
new_color = "const areaColor = houseThemes[num]?.themeColor || '#10b981';"
content = content.replace(old_color, new_color)

# Fix imageForThisHouse to handle Unsplash IDs correctly
old_img = """                  const imageForThisHouse = resultForHouse?.options?.highticket?.img 
                    ? resultForHouse.options.highticket.img 
                    : getAtmosphericFallback(num);"""
new_img = """                  const rawImg = resultForHouse?.options?.highticket?.img;
                  const imageForThisHouse = rawImg 
                    ? (rawImg.startsWith("http") ? rawImg : `https://images.unsplash.com/photo-${rawImg}?auto=format&fit=crop&w=1000&q=80`) 
                    : getAtmosphericFallback(num);"""
content = content.replace(old_img, new_img)

# Fix the image tag inside the footer grid to handle Mumbai broken image fallback
old_img_tag = """<img src={isCurrent ? getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img) : imageForThisHouse} alt={cityForThisHouse} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />"""
new_img_tag = """<img src={isCurrent ? getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house, bestCity?.img) : imageForThisHouse} onError={(e) => { e.currentTarget.src = getAtmosphericFallback(num); }} alt={cityForThisHouse} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />"""
content = content.replace(old_img_tag, new_img_tag)


with open(file_path, "w") as f:
    f.write(content)

print("Footer grid aesthetics fixed!")
