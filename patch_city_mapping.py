import os
import re
import json

cities_dir = "public/assets/cities"
files = [f for f in os.listdir(cities_dir) if f.endswith(".mp4") or f.endswith(".mov")]

mapping = {}
for f in files:
    # Remove extension
    name = os.path.splitext(f)[0]
    # Clean the name to get the key
    key = name.replace("_", " ").lower()
    mapping[key] = f
    
    # Add common variations
    if key == "new york":
        mapping["nova york"] = f
    elif key == "tokyo":
        mapping["toquio"] = f
    elif key == "sao paulo":
        mapping["são paulo"] = f
    elif key == "vitoria":
        mapping["vitória"] = f
    elif key == "goiania":
        mapping["goiânia"] = f
    elif key == "brasilia":
        mapping["brasília"] = f
    elif key == "maceio":
        mapping["maceió"] = f
    elif key == "florianopolis":
        mapping["florianópolis"] = f
    elif key == "joao pessoa":
        mapping["joão pessoa"] = f
    elif key == "belem":
        mapping["belém"] = f
    elif key == "sao luis":
        mapping["são luís"] = f
    elif key == "foz do iguacu":
        mapping["foz do iguaçu"] = f
    elif key == "balneario camboriu":
        mapping["balneário camboriú"] = f
    elif key == "buzios":
        mapping["búzios"] = f
    elif key == "paris":
        mapping["paris"] = f
    elif key == "london":
        mapping["londres"] = f
    elif key == "roma":
        mapping["rome"] = f
    elif key == "athens":
        mapping["atenas"] = f
    elif key == "florence":
        mapping["florença"] = f
    elif key == "venice":
        mapping["veneza"] = f
    elif key == "cidade do mexico":
        mapping["cidade do méxico"] = f
    elif key == "singapore":
        mapping["cingapura"] = f
    elif key == "mumbai":
        mapping["bombaim"] = f

# Now we need to patch the getHeroVideo function in AppleResultPreviewV3.tsx
file_path = "src/pages/AppleResultPreviewV3.tsx"
with open(file_path, "r") as f:
    content = f.read()

# We need to replace the `const map: Record<string, string> = { ... };` 
# and the `return /assets/${file};`
# Let's use regex to find the getHeroVideo body.

pattern = r"const getHeroVideo = \(cityName: string\) => \{[\s\S]*?return `/assets/\$\{file\}`;\n    \}\n    return null;"

new_body = f"""const getHeroVideo = (cityName: string) => {{
    if (!cityName) return "/assets/particles.mp4";
    
    // Pega só o nome da cidade (antes da vírgula)
    const baseCity = cityName.split(',')[0].trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Mapeamento dinâmico baseado nos arquivos de assets/cities
    const map: Record<string, string> = {json.dumps(mapping, indent=6)};
    
    const file = map[baseCity] || map[Object.keys(map).find(k => baseCity.includes(k)) || ""];
    if (file) return `/assets/cities/${{file}}`;
    
    return null;"""

content = re.sub(pattern, new_body, content)

with open(file_path, "w") as f:
    f.write(content)

print(f"Mapped {len(mapping)} keys.")
