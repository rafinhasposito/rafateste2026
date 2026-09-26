const fs = require('fs');

let tsFile = fs.readFileSync('src/data/houseThemes.ts', 'utf8');

const subtitles = {
  1: "A energia do Protagonismo, da Coragem e do Recomeço",
  2: "A energia do Dinheiro, da Prosperidade e da Abundância",
  3: "A energia da Comunicação, das Vendas e do Movimento",
  4: "A energia do Lar, da Família e da Paz Interior",
  5: "A energia do Romance, do Prazer e do Brilho Pessoal",
  6: "A energia da Saúde, da Vitalidade e da Organização",
  7: "A energia do Casamento, do Compromisso e das Parcerias",
  8: "A energia da Transformação, do Poder e da Intimidade",
  9: "A energia das Viagens, da Liberdade e da Expansão",
  10: "A energia da Fama, do Sucesso e do Reconhecimento",
  11: "A energia dos Amigos, das Conexões e do Futuro",
  12: "A energia da Paz, da Intuição e da Recarga Espiritual"
};

for (let i = 1; i <= 12; i++) {
  // We need to replace the exact subtitle for this house.
  // The structure is roughly:
  // "id": X,
  // "name": "Casa X",
  // "themeColor": "...",
  // "subtitle": "...",
  
  const regex = new RegExp(`"id":\\s*${i},\\s*"name":\\s*"Casa ${i}",\\s*"themeColor":\\s*"[^"]+",\\s*"subtitle":\\s*"[^"]*"`, 'g');
  
  tsFile = tsFile.replace(regex, (match) => {
    return match.replace(/"subtitle":\s*"[^"]*"/, `"subtitle": "${subtitles[i]}"`);
  });
}

fs.writeFileSync('src/data/houseThemes.ts', tsFile);
console.log("Subtitles patched!");
