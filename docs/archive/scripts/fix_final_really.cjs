const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// Inject Accordion and Rotas Alternativas right before the Grid we just injected
const searchGrid = `{/* BLOCO 7: O MAPA DAS 12 COORDENADAS (UPSELL) */}`;
const replaceContent = `
                  {/* --- AS 8 DIMENSÕES DO SEU ANO (ACCORDION SAGRADO) --- */}
                  <div className="w-full max-w-4xl mx-auto mt-32 mb-16 px-4 md:px-0 text-left">
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

                  {/* BLOCO 8: ROTAS ALTERNATIVAS (CIDADES EXTRAS GRÁTIS) */}
                      <div className="w-full max-w-7xl mx-auto mt-20 mb-32 px-6">
                        <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                          <div>
                            <h2 className="font-ps-display text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-left">
                              Rotas Alternativas
                            </h2>
                            <p className="text-white/50 text-base md:text-lg max-w-2xl font-light text-left">
                              Se o seu Destino Mestre não for viável, estas coordenadas secundárias também ativam a energia desta casa.
                            </p>
                          </div>
                          <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                             <Sparkles className="w-4 h-4 text-emerald-400" />
                             <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">Incluso</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {[
                            { title: "Nacional", desc: "Acessível e perto de você", data: citiesObj.nacional || [] },
                            { title: "Acessível", desc: "Viagem internacional viável", data: citiesObj.acessivel || [] },
                            { title: "High Ticket", desc: "Destino de alto padrão", data: citiesObj.highticket || [] }
                          ].map((tier, idx) => (
                            <div key={idx} className="flex flex-col gap-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-xs font-bold">{idx+1}</div>
                                <div>
                                  <h4 className="font-bold text-lg">{tier.title}</h4>
                                  <p className="text-white/50 text-xs uppercase tracking-wider">{tier.desc}</p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-4">
                                {tier.data.map((city, i) => (
                                  <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:bg-white/5 transition-colors relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[100px] pointer-events-none group-hover:bg-[#10b981]/10 transition-colors"></div>
                                    <div className="flex justify-between items-start mb-4">
                                      <h5 className="font-ps-display text-2xl font-bold">{city.city}</h5>
                                      <span className="font-mono text-xs font-bold bg-[#10b981]/20 text-[#10b981] px-2 py-1 rounded">
                                        {city.score}% MATCH
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50 text-sm">
                                      <MapPin className="w-4 h-4" />
                                      <span>{city.country}</span>
                                    </div>
                                  </div>
                                ))}
                                {tier.data.length === 0 && (
                                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-white/40 text-sm italic">
                                    Nenhuma rota encontrada para este nível.
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BLOCO 7: O MAPA DAS 12 COORDENADAS (UPSELL) */}`;

if (code.includes(searchGrid)) {
  code = code.replace(searchGrid, replaceContent);
  // Add Accordion import
  if (!code.includes('import { Accordion')) {
    code = code.replace(`import { DesktopWebChrome`, `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";\nimport { DesktopWebChrome`);
  }
  fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
  console.log("Restored Accordion and Rotas!");
} else {
  console.log("Could not find Grid to insert before.");
}
