import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_use_effect = '''  useEffect(() => {
    const cityName = P_DYNAMIC.city;
    const houseId = P_DYNAMIC.house;
    if (!cityName) return;
    const cleanCity = cityName.split(',')[0].trim();
    
    const localFallback = getHouseImageUrl(cleanCity, houseId);
    if (localFallback && !localFallback.includes("unsplash.com/photo-1542281286")) {
      setWikiHeroImage(localFallback);
      return;
    }'''

new_use_effect = '''  useEffect(() => {
    const cityName = P_DYNAMIC.city;
    const houseId = P_DYNAMIC.house;
    if (!cityName) return;
    const cleanCity = cityName.split(',')[0].trim();
    
    const localFallback = getHouseImageUrl(cleanCity, houseId);
    
    const isGenericFallback = localFallback && localFallback.includes("unsplash.com/photo-") && (
        localFallback.includes("1542281286") || localFallback.includes("1579532537") || 
        localFallback.includes("1519389950") || localFallback.includes("1449844908") ||
        localFallback.includes("1492684223") || localFallback.includes("1494500764") ||
        localFallback.includes("1511895426") || localFallback.includes("1518709268") ||
        localFallback.includes("1454496522") || localFallback.includes("1486406146") ||
        localFallback.includes("1511649475") || localFallback.includes("1490730141")
    );

    if (localFallback && !isGenericFallback) {
      setWikiHeroImage(localFallback);
      return;
    }'''

content = content.replace(old_use_effect, new_use_effect)

# Now fix Block 4 to use wikiHeroImage instead of houseFixedImageUrl
content = content.replace('''                                    src={houseFixedImageUrl} 
                                    alt={P_DYNAMIC.city} ''',
'''                                    src={wikiHeroImage || houseFixedImageUrl} 
                                    alt={P_DYNAMIC.city} ''')

with open(file_path, "w") as f:
    f.write(content)

