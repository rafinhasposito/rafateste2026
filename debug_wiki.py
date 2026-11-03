import re

file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_use_effect = '''  useEffect(() => {
    if (!cityName || cityName === "Bloqueado" || cityName === "Desconhecido") return;
    
    const isGenericFallback = localFallback && localFallback.includes("unsplash.com/photo-") && ('''

new_use_effect = '''  useEffect(() => {
    console.log("WikiImage rendered for:", cityName, "imgSrc:", imgSrc, "localFallback:", localFallback);
    if (!cityName || cityName === "Bloqueado" || cityName === "Desconhecido") return;
    
    const isGenericFallback = localFallback && localFallback.includes("unsplash.com/photo-") && ('''

content = content.replace(old_use_effect, new_use_effect)

with open(file_path, "w") as f:
    f.write(content)

