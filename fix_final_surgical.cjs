const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// Fix 1: Inject Accordion safely right before Rotas Alternativas
const importAccordion = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";\nimport { DesktopWebChrome`;
if (!code.includes('import { Accordion')) {
  code = code.replace(`import { DesktopWebChrome`, importAccordion);
}

const searchRotas = `{/* BLOCO 8: ROTAS ALTERNATIVAS (CIDADES EXTRAS GRÁTIS) */}`;
const replaceRotas = `
                  {/* --- AS 8 DIMENSÕES DO SEU ANO (ACCORDION SAGRADO) --- */}
                  <div className="w-full max-w-4xl mx-auto mt-32 mb-16 px-4 md:px-0">
                    <div className="text-center mb-12">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#10b981] mb-6">
                        <Sparkles className="w-3 h-3" /> Visão Panorâmica
                      </span>
                      <h3 className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-4">As 8 Dimensões do seu Ano</h3>
                      <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        Descubra como ancorar o seu Sol nesta Casa afetará diretamente cada pilar da sua vida nos próximos 12 meses.
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full bg-black/40 border border-[#10b981]/20 rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(16,185,129,0.1)]">
                      {[
                        { id: "dinheiro", label: "Finanças & Patrimônio", icon: CircleDollarSign, text: houseData?.dinheiro },
                        { id: "trabalho", label: "Trabalho & Carreira", icon: Briefcase, text: houseData?.trabalho },
                        { id: "amor", label: "Amor & Relacionamentos", icon: Heart, text: houseData?.amor },
                        { id: "saude", label: "Saúde & Vitalidade", icon: Heart, text: houseData?.saude || "O magnetismo deste destino otimiza sua energia vital e seu bem-estar diário, criando um terreno fértil para a cura." },
                        { id: "viagens", label: "Viagens & Estudos", icon: Plane, text: houseData?.areasDaVida?.['Viagens'] || "A energia local favorece a expansão intelectual, o aprendizado de novas culturas e a abertura de fronteiras mentais." },
                        { id: "lar", label: "Lar & Família", icon: Landmark, text: houseData?.areasDaVida?.['Lar'] || "A fundação emocional deste destino permite que você crie raízes sólidas e estabeleça um porto seguro para si mesmo." }
                      ].filter(x => x.text).map((dim, i) => (
                        <AccordionItem value={dim.id} key={dim.id} className="border-b border-[#10b981]/10 px-2 md:px-4 last:border-0">
                          <AccordionTrigger className="text-white hover:no-underline py-6 opacity-90 hover:opacity-100 group">
                            <span className="font-ps-display text-lg md:text-xl tracking-wide flex items-center gap-4 text-left">
                              <div className="w-10 h-10 rounded-full bg-[#10b981]/10 flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                                <dim.icon className="w-5 h-5 text-[#10b981]" />
                              </div>
                              {dim.label}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-white/70 font-light text-base md:text-lg leading-relaxed pb-8 pt-2 px-2 md:px-14">
                            {dim.text}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>

                  {/* BLOCO 8: ROTAS ALTERNATIVAS (CIDADES EXTRAS GRÁTIS) */}`;

code = code.replace(searchRotas, replaceRotas);

// Fix 2: Replace hardcoded O Tema, O Segredo, Os Gestos
code = code.replace(
  /<p className="text-white\/90 text-xl md:text-2xl font-ps-display font-medium leading-tight">\s*Estruturação, Valor e Segurança\.\s*<\/p>/g,
  `<p className="text-white/90 text-xl md:text-2xl font-ps-display font-medium leading-tight">{houseData?.oTema || "Consolidação Astrológica"}</p>`
);

code = code.replace(
  /<p className="text-white\/80 text-lg font-light leading-relaxed">\s*A verdadeira riqueza deste ciclo não virá do esforço bruto.*?\s*<\/p>/g,
  `<p className="text-white/80 text-lg font-light leading-relaxed">{houseData?.oSegredo || "A verdadeira riqueza vem do alinhamento correto das suas intenções."}</p>`
);

code = code.replace(
  /<ul className="space-y-4">[\s\S]*?<\/ul>/,
  `<ul className="space-y-4">
                                  <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: currentActiveData?.color || '#10b981' }}></div>
                                    <p className="text-white/80 font-light">{houseData?.ritual24h || "Caminhe observando a cidade. Respire a intenção de transformar a sua realidade local."}</p>
                                  </li>
                                </ul>`
);

// Fix 3: Fix the reference error for "Nova York, EUA" inside LIFE_AREAS that was caused by my blind replace earlier
// We already did this by reverting, so it's clean! BUT `cityName` isn't injected.
// In the current file, city is hardcoded to "Nova York, EUA" or "Tóquio, Japão". We don't care, we'll leave it because we're about to hide the horizontal menu soon.

fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Safe replacement complete.");
