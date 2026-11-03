import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace extractRoute
old_extract = """  const extractRoute = (tierData: any, fallbackName: string) => {
    if (!tierData) return null;
    return {
      ...tierData,
      city: tierData.city || tierData.name || "Destino",
      score: tierData.score || (fallbackName === 'Nacional' ? 96 : fallbackName === 'Acessível' ? 94 : 98),
      img: tierData.img || getAtmosphericFallback(P_DYNAMIC.house)
    };
  };"""

new_extract = """  const extractRoute = (tierData: any, fallbackName: string) => {
    if (!tierData) return null;
    // tierData is an array of cities from Python API
    const cityData = Array.isArray(tierData) ? tierData[0] : tierData;
    if (!cityData) return null;
    return {
      ...cityData,
      city: cityData.city || cityData.name || "Destino",
      score: cityData.score || (fallbackName === 'Nacional' ? 96 : fallbackName === 'Acessível' ? 94 : 98),
      img: cityData.img || getAtmosphericFallback(P_DYNAMIC.house)
    };
  };"""

content = content.replace(old_extract, new_extract)

with open(file_path, "w") as f:
    f.write(content)

print("extractRoute fixed!")
