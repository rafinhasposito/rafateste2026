const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV5.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Tema
content = content.replace(
  '<p className="text-white text-2xl md:text-4xl font-ps-display font-medium leading-tight">\n                            Consolidação e Crescimento Material\n                          </p>',
  '<p className="text-white text-xl md:text-2xl font-ps-display font-medium leading-tight">\n                            {currentHouseData?.tema}\n                          </p>'
);

// 2. Segredo
content = content.replace(
  '<p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">\n                            A verdadeira prosperidade neste ciclo não virá do esforço exaustivo, mas do posicionamento estratégico. O universo pede que você pare de trocar tempo por dinheiro e comece a ancorar o seu valor. A cidade destino ativa a frequência da abundância: o dinheiro que trabalha para você.\n                          </p>',
  '<p className="text-white/70 text-lg md:text-xl font-light leading-relaxed whitespace-pre-wrap">\n                            {currentHouseData?.segredo}\n                          </p>'
);

// 3. Mantra
content = content.replace(
  '<p className="text-white text-2xl md:text-3xl font-light leading-snug">\n                              "Eu construo meu patrimônio com solidez, sabedoria e estratégia. O universo me recompensa proporcionalmente ao meu valor."\n                            </p>',
  '<p className="text-white text-2xl md:text-3xl font-light leading-snug">\n                              "{currentHouseData?.mantra}"\n                            </p>'
);

// 4. Ritual
content = content.replace(
  '<p className="text-white/80 font-light leading-relaxed mb-6">\n                            Assim que você pousar no destino, não ligue o celular imediatamente. Sente em um café local, pegue um papel e anote as três metas financeiras mais ousadas da sua vida. Dobre o papel e guarde na sua carteira.\n                          </p>',
  '<p className="text-white/80 font-light leading-relaxed mb-6">\n                            {currentHouseData?.ritual}\n                          </p>'
);

// 5. Fases
const oldFases = `            {[
              { phase: "Fase 1: Estruturação", period: "Meses 1 a 4", text: "Momento de organizar as finanças, cortar excessos e plantar as sementes estratégicas da sua nova economia." },
              { phase: "Fase 2: Escala", period: "Meses 5 a 8", text: "O trabalho plantado na primeira fase começa a tracionar. É o momento de aumentar o seu preço e firmar grandes contratos." },
              { phase: "Fase 3: Colheita", period: "Meses 9 a 12", text: "Os resultados se estabilizam. Você alcança a segurança financeira e prepara o terreno para o seu próximo salto." }
            ].map((f, i) => (`;

const newFases = `            {[
              { phase: "Fase 1: Início", period: "Meses 1 a 4", text: currentHouseData?.fase1 },
              { phase: "Fase 2: Meio", period: "Meses 5 a 8", text: currentHouseData?.fase2 },
              { phase: "Fase 3: Fim", period: "Meses 9 a 12", text: currentHouseData?.fase3 }
            ].map((f, i) => (`;

content = content.replace(oldFases, newFases);

fs.writeFileSync(file, content);
console.log("Replaced fake texts with REAL_HOUSES_DATA mapping in V5.");
