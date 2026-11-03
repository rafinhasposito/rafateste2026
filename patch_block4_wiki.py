import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# First, remove useCityImage completely because it's unused and causing warnings.
# I will just use regex to remove it.
content = re.sub(r'const useCityImage =.*?return imgUrl;\n};\n', '', content, flags=re.DOTALL)

# Now, replace the motion.img in Block 4 with WikiImage inside a motion.div
old_block4_img = '''<motion.img 
                                    initial={{ scale: 1.1 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ duration: 2.5, ease: "easeOut" }}
                                    src={houseFixedImageUrl} 
                                    alt={P_DYNAMIC.city} 
                                    className="w-full h-full object-cover object-center" 
                                  />'''

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

content = content.replace(old_block4_img, new_block4_img)

with open(file_path, "w") as f:
    f.write(content)

