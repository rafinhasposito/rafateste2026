import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_wiki_image = '''          ) : (
            <WikiImage 
              cityName={P_DYNAMIC.city} 
              initialSrc={bestCity?.img || getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house)} 
              fallbackSrc={getAtmosphericFallback(P_DYNAMIC.house)} 
              alt={P_DYNAMIC.city} 
              className="w-full h-full object-cover" 
            />
          )}'''

new_wiki_image = '''          ) : (
            <WikiImage 
              key={P_DYNAMIC.city}
              cityName={P_DYNAMIC.city} 
              initialSrc={bestCity?.img || getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house)} 
              fallbackSrc={getAtmosphericFallback(P_DYNAMIC.house)} 
              alt={P_DYNAMIC.city} 
              className="w-full h-full object-cover" 
            />
          )}'''

content = content.replace(old_wiki_image, new_wiki_image)

with open(file_path, "w") as f:
    f.write(content)

