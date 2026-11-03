import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# I will replace the img tag inside Rotas Alternativas.

old_img_tag = '''<img src={city.img} alt={city.city} className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-all duration-1000 ease-[0.19,1,0.22,1]" />'''

new_img_tag = '''<WikiImage 
                            cityName={city.city || city.name}
                            initialSrc={city.img}
                            fallbackSrc={getAtmosphericFallback(P_DYNAMIC.house)}
                            alt={city.city || "City"} 
                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-90 transition-all duration-1000 ease-[0.19,1,0.22,1]" 
                          />'''

content = content.replace(old_img_tag, new_img_tag)

with open(file_path, "w") as f:
    f.write(content)

