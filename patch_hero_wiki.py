import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# I will replace the Hero img tag with a WikiImage tag.

old_img_tag = '''<img src={heroImageSrc} alt={P_DYNAMIC.city} className="w-full h-full object-cover" />'''
new_img_tag = '''<WikiImage 
              cityName={P_DYNAMIC.city} 
              initialSrc={bestCity?.img || getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house)} 
              fallbackSrc={getAtmosphericFallback(P_DYNAMIC.house)} 
              alt={P_DYNAMIC.city} 
              className="w-full h-full object-cover" 
            />'''

content = content.replace(old_img_tag, new_img_tag)

with open(file_path, "w") as f:
    f.write(content)

