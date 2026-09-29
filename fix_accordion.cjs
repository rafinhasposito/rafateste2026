const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const searchAccordion = `{[
                        { id: "dinheiro", label: "Finanças & Patrimônio", icon: CircleDollarSign, text: houseData?.dinheiro },
                        { id: "trabalho", label: "Trabalho & Carreira", icon: Briefcase, text: houseData?.trabalho },
                        { id: "amor", label: "Amor & Relacionamentos", icon: Heart, text: houseData?.amor },
                        { id: "saude", label: "Saúde & Vitalidade", icon: Heart, text: houseData?.saude || "O magnetismo deste destino otimiza sua energia vital e seu bem-estar diário, criando um terreno fértil para a cura." },
                        { id: "viagens", label: "Viagens & Estudos", icon: Plane, text: houseData?.areasDaVida?.['Viagens'] || "A energia local favorece a expansão intelectual, o aprendizado de novas culturas e a abertura de fronteiras mentais." },
                        { id: "lar", label: "Lar & Família", icon: Landmark, text: houseData?.areasDaVida?.['Lar'] || "A fundação emocional deste destino permite que você crie raízes sólidas e estabeleça um porto seguro para si mesmo." }
                      ].filter(x => x.text).map((dim, i) => (`;

const replaceAccordion = `{[
                        { id: "dinheiro", label: "Finanças & Patrimônio", icon: CircleDollarSign, text: houseData?.dinheiro },
                        { id: "trabalho", label: "Trabalho & Carreira", icon: Briefcase, text: houseData?.trabalho },
                        { id: "amor", label: "Amor & Relacionamentos", icon: Heart, text: houseData?.amor },
                        { id: "vidaPessoal", label: "Vida Pessoal & Saúde", icon: Sparkles, text: houseData?.vidaPessoal },
                        { id: "saude", label: "Saúde & Vitalidade", icon: Heart, text: houseData?.saude },
                        { id: "viagens", label: "Viagens & Estudos", icon: Plane, text: houseData?.areasDaVida?.['Viagens'] },
                        { id: "lar", label: "Lar & Família", icon: Landmark, text: houseData?.areasDaVida?.['Lar'] }
                      ].filter(x => x.text).map((dim, i) => (`;

if (code.includes(searchAccordion)) {
  code = code.replace(searchAccordion, replaceAccordion);
  fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
  console.log("Accordion fixed!");
} else {
  console.log("Could not find the Accordion array to fix.");
}
