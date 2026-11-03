import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace {city.city} with {city.city || city.name || "Destino Desconhecido"}
content = content.replace('{city.city}</h5>', '{city.city || city.name || "Destino Desconhecido"}</h5>')

# Also fix the fallback in extractRoute just in case
old_extract = """  const extractRoute = (tierData: any, fallbackName: string) => {
    if (!tierData) return null;
    return {
      ...tierData,
      score: tierData.score || (fallbackName === 'Nacional' ? 96 : fallbackName === 'Acessível' ? 94 : 98),
      img: tierData.img || getAtmosphericFallback(P_DYNAMIC.house)
    };
  };"""

new_extract = """  const extractRoute = (tierData: any, fallbackName: string) => {
    if (!tierData) return null;
    return {
      ...tierData,
      city: tierData.city || tierData.name || "Destino",
      score: tierData.score || (fallbackName === 'Nacional' ? 96 : fallbackName === 'Acessível' ? 94 : 98),
      img: tierData.img || getAtmosphericFallback(P_DYNAMIC.house)
    };
  };"""

content = content.replace(old_extract, new_extract)

with open(file_path, "w") as f:
    f.write(content)

print("Rotas Alternativas text fixed!")
