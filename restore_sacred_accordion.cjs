const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// 1. Add import
if (!code.includes('import { Accordion')) {
  code = code.replace(
    `import { DesktopWebChrome } from "@/layouts/DesktopWebChrome";`,
    `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";\nimport { DesktopWebChrome } from "@/layouts/DesktopWebChrome";`
  );
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
                        Descubra como ancorar o seu Sol em {cityName} afetará diretamente cada pilar da sua vida nos próximos 12 meses.
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full bg-black/40 border border-[#10b981]/20 rounded-3xl p-4 md:p-6 backdrop-blur-xl shadow-[0_30px_80px_rgba(16,185,129,0.1)]">
                      {[
                        { id: "dinheiro", label: "Finanças & Patrimônio", icon: CircleDollarSign, text: houseData.dinheiro },
                        { id: "trabalho", label: "Trabalho & Carreira", icon: Briefcase, text: houseData.trabalho },
                        { id: "amor", label: "Amor & Relacionamentos", icon: Heart, text: houseData.amor },
                        { id: "saude", label: "Saúde & Vitalidade", icon: Heart, text: houseData.saude || "O magnetismo deste destino otimiza sua energia vital e seu bem-estar diário, criando um terreno fértil para a cura." },
                        { id: "viagens", label: "Viagens & Estudos", icon: Plane, text: houseData.areasDaVida?.['Viagens'] || "A energia local favorece a expansão intelectual, o aprendizado de novas culturas e a abertura de fronteiras mentais." },
                        { id: "lar", label: "Lar & Família", icon: Landmark, text: houseData.areasDaVida?.['Lar'] || "A fundação emocional deste destino permite que você crie raízes sólidas e estabeleça um porto seguro para si mesmo." }
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

if (code.includes(searchRotas)) {
  code = code.replace(searchRotas, replaceRotas);
  fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
  console.log("Accordion restored!");
} else {
  console.log("Could not find rotas block to inject Accordion.");
}
