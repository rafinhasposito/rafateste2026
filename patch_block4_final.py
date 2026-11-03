import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Find the motion.img inside Block 4 (under "1. O HERO: Foto Panor")
pattern = re.compile(r'<motion\.img\s+initial=\{\{\s*scale:\s*1\.1\s*\}\}\s+whileInView=\{\{\s*scale:\s*1\s*\}\}\s+transition=\{\{\s*duration:\s*2\.5,\s*ease:\s*"easeOut"\s*\}\}\s+src=\{wikiHeroImage\s*\|\|\s*houseFixedImageUrl\}\s+alt=\{P_DYNAMIC\.city\}\s+className="w-full\s+h-full\s+object-cover\s+object-center"\s*/>')

new_block4_img = '''<motion.div 
                                    initial={{ scale: 1.1 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 2.5, ease: "easeOut" }}
                                    className="w-full h-full"
                                  >
                                    <WikiImage 
                                      cityName={P_DYNAMIC.city}
                                      initialSrc={bestCity?.img}
                                      fallbackSrc={getAtmosphericFallback(P_DYNAMIC.house)}
                                      localFallback={getHouseImageUrl(P_DYNAMIC.city, P_DYNAMIC.house)}
                                      alt={P_DYNAMIC.city}
                                      className="w-full h-full object-cover object-center"
                                    />
                                  </motion.div>'''

content = pattern.sub(new_block4_img, content)

with open(file_path, "w") as f:
    f.write(content)

