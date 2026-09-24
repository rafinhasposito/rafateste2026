const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

// First, make sure we import all the required icons from lucide-react
const lucideImports = 'import { ArrowRight, MapPin, Zap, ShieldAlert, Lock, Eye, PlayCircle, Download, Clock, Target, CheckCircle2, BookOpen, Wallet, Heart, Briefcase, Activity, User, Users, Map, Sparkles, Crosshair, Compass, Cpu, Orbit } from "lucide-react";';

// Replace the old import line (which has Wallet, Heart, Briefcase) with the new one
content = content.replace(/import { ArrowRight, MapPin[\s\S]*?} from "lucide-react";/, lucideImports);

// Now, insert the "Caixa Preta do Algoritmo" right before "2. RAIO-X"
const caixaPreta = `
        {/* 1.5 CAIXA PRETA DO ALGORITMO - PARÂMETROS ASTRONÔMICOS */}
        <section className="mb-12">
           <div className="flex items-center gap-4 mb-8">
             <h3 className="font-ps-display text-2xl md:text-3xl text-foreground">Parâmetros Astrológicos Calculados</h3>
             <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
           </div>

           <div className="bg-[#020205] border border-primary/20 rounded-3xl p-6 md:p-8 shadow-[0_0_30px_hsl(var(--primary)/0.05)] relative overflow-hidden">
             {/* Tech Grid Background */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
             
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="flex items-start gap-4">
                   <div className="mt-1 p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <MapPin className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block font-semibold mb-1">Coordenadas Geográficas</span>
                      <p className="font-mono text-sm text-foreground/90">{masterCity.lat ? masterCity.lat.toFixed(4) : "35.6762"}° N · {masterCity.lon ? masterCity.lon.toFixed(4) : "139.6503"}° E</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="mt-1 p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <Clock className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block font-semibold mb-1">Retorno Solar Exato</span>
                      <p className="font-mono text-sm text-foreground/90">15/03/2026 às 18:42:12</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="mt-1 p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <Compass className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block font-semibold mb-1">Cúspides Relocalizadas</span>
                      <p className="font-mono text-sm text-foreground/90">Asc em 12°30' · MC em 28°15'</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="mt-1 p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <Crosshair className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block font-semibold mb-1">Ativação da Casa</span>
                      <p className="font-mono text-sm text-foreground/90">Cúspide {house} a 04°15' do Signo</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="mt-1 p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <Orbit className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block font-semibold mb-1">Linhas Astrocartográficas</span>
                      <p className="font-mono text-sm text-foreground/90">Linha Sol/MC a 42km de dist.</p>
                   </div>
                </div>

                <div className="flex items-start gap-4">
                   <div className="mt-1 p-2 bg-primary/10 rounded-lg border border-primary/20">
                      <Cpu className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block font-semibold mb-1">Índice de Alinhamento</span>
                      <p className="font-mono text-sm text-primary font-bold">{masterCity.score || 98.4}% Match com a Intenção</p>
                   </div>
                </div>

             </div>
           </div>
        </section>

        {/* 2. RAIO-X`;

content = content.replace('{/* 2. RAIO-X', caixaPreta);

// Now, replace the 3-item Accordion with the 8-item Accordion
const oldAccordionStart = content.indexOf('<Accordion type="single" collapsible');
const oldAccordionEnd = content.indexOf('</Accordion>') + '</Accordion>'.length;

const newAccordion = `<Accordion type="single" collapsible className="w-full bg-background/40 border border-primary/10 rounded-3xl p-2 backdrop-blur-md shadow-xl">
              <AccordionItem value="identidade" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <User className="w-5 h-5 text-primary" /> Identidade & Autoconhecimento
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.areasDaVida?.['Identidade'] || houseDataFull.oQueVocePodeGanhar || "Como essa revolução moldará suas atitudes diárias, autoconfiança e a imagem que projeta no mundo. Dados astrológicos em processamento."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dinheiro" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Wallet className="w-5 h-5 text-primary" /> Finanças Recorrentes & Patrimônio
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.dinheiro || houseDataFull.areasDaVida?.['Dinheiro'] || "O impacto prático nas suas fontes de receita, capacidade de gerar riqueza e reorganização financeira ao longo dos 365 dias."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="trabalho" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Briefcase className="w-5 h-5 text-primary" /> Trabalho, Produção & Carreira
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.trabalho || houseDataFull.areasDaVida?.['Carreira'] || "A leitura focada no seu ambiente corporativo, fechamento de acordos, produtividade e novas portas profissionais."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="amor" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Heart className="w-5 h-5 text-primary" /> Amor & Afeto
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.amor || houseDataFull.areasDaVida?.['Amor'] || "As frequências afetivas, atração de parcerias de alto valor e a dinâmica emocional que guiará este ciclo."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="saude" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Activity className="w-5 h-5 text-primary" /> Vida Pessoal & Saúde Física
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.vidaPessoal || houseDataFull.areasDaVida?.['Saúde'] || "Como essa coordenada afeta a sua disposição, vitalidade e a necessidade de estruturar novos hábitos físicos e mentais."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="networking" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Users className="w-5 h-5 text-primary" /> Networking & Alianças
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.areasDaVida?.['Social'] || "A capacidade de conectar com pessoas que abrem portas, atrair clientes influentes e consolidar sua presença social."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rotina" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Map className="w-5 h-5 text-primary" /> Rotina & Cotidiano
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.comoApareceNaVidaReal || "A forma prática como seus dias serão estruturados, eliminando a sobrecarga e organizando o fluxo de tarefas."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="espiritualidade" className="border-b-0 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Sparkles className="w-5 h-5 text-primary" /> Espiritualidade & Energia
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.areasDaVida?.['Espiritual'] || "Sua conexão interna, capacidade de intuição e o alinhamento com propósitos de longo prazo neste ciclo exato."}
                </AccordionContent>
              </AccordionItem>
           </Accordion>`;

content = content.slice(0, oldAccordionStart) + newAccordion + content.slice(oldAccordionEnd);

fs.writeFileSync(file, content);
console.log("Results V3 applied with Caixa Preta and 8 Accordions!");
