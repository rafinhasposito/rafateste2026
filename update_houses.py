import json
import re

# We will read the file and do precise replacements for label and intent.
file_path = "src/data/houses.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

updates = {
    1: ("CASA 1", "A energia do Protagonismo, da Coragem e do Recomeço"),
    2: ("CASA 2", "A energia do Dinheiro, da Prosperidade e da Abundância"),
    3: ("CASA 3", "A energia da Comunicação, das Vendas e do Movimento"),
    4: ("CASA 4", "A energia do Lar, da Família e da Paz Interior"),
    5: ("CASA 5", "A energia do Romance, do Prazer e do Brilho Pessoal"),
    6: ("CASA 6", "A energia da Saúde, da Vitalidade e da Organização"),
    7: ("CASA 7", "A energia do Casamento, do Compromisso e das Parcerias"),
    8: ("CASA 8", "A energia da Transformação, do Poder e da Intimidade"),
    9: ("CASA 9", "A energia das Viagens, da Liberdade e da Expansão"),
    10: ("CASA 10", "A energia da Fama, do Sucesso e do Reconhecimento"),
    11: ("CASA 11", "A energia dos Amigos, das Conexões e do Futuro"),
    12: ("CASA 12", "A energia da Paz, da Intuição e da Recarga Espiritual")
}

for house_id, (new_label, new_intent) in updates.items():
    # Find the block for this house
    block_regex = re.compile(rf'({house_id}:\s*{{.*?)(\s*id:\s*{house_id},)(.*?)(\s*label:\s*".*?",)(.*?)(\s*intent:\s*".*?",)', re.DOTALL)
    
    def repl(m):
        return f'{m.group(1)}{m.group(2)}{m.group(3)}\n    label: "{new_label}",{m.group(5)}\n    intent: "{new_intent}",'
        
    content = block_regex.sub(repl, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated houses.ts")
