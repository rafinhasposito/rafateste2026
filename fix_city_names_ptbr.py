file_path = "../protocolo-solar-api/house_scanner.py"
with open(file_path, "r") as f:
    content = f.read()

# Corrigir nomes PT-PT para PT-BR
replacements = {
    '"city": "Nova Iorque"': '"city": "Nova York"',
    '"city": "Quioto"': '"city": "Kyoto"',
    '"city": "Banguecoque"': '"city": "Bangkok"',
    '"city": "Singapura"': '"city": "Cingapura"',
    '"city": "Amesterdão"': '"city": "Amsterdã"',
    '"city": "Copenhaga"': '"city": "Copenhague"',
    '"city": "Nova Deli"': '"city": "Nova Délhi"',
    '"city": "Mahé"': '"city": "Seychelles"',
    '"city": "São Francisco"': '"city": "San Francisco"',
    '"city": "Filadélfia"': '"city": "Filadélfia"',  # keep
    '"city": "Cidade do Vaticano"': '"city": "Vaticano"',
    '"city": "Cidade do Panamá"': '"city": "Cidade do Panamá"',  # keep
    # Aliases no normalize_city_name
    '"bangkok": "Banguecoque"': '"bangkok": "Bangkok"',
}

for old, new in replacements.items():
    if old != new:
        content = content.replace(old, new)

with open(file_path, "w") as f:
    f.write(content)

print("Done!")
for old, new in replacements.items():
    if old != new:
        print(f"  {old} -> {new}")
