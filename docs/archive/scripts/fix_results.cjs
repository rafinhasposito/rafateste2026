const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';

const content = `import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCountryFlag } from "@/lib/countryFlags";
import { 
  ArrowRight, MapPin, Zap, ShieldAlert, Lock, Eye, PlayCircle, 
  Download, Clock, Target, CheckCircle2, BookOpen, 
  Wallet, Heart, Briefcase, Activity, User, Users, Map, Sparkles, 
  FileText, Calendar, Compass, Hash
} from "lucide-react";
import { useAlert } from "@/hooks/useAlert";
import { useNavigate } from "react-router-dom";
import { ATLAS_DO_DESTINO } from "@/data/atlas";
import { cityDatabase, fallbackOraclesFuture, fallbackOraclesPast } from "@/data/houses";
import { useAuth } from "@/hooks/useAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function groupCitiesByContinent(cities: any[]) {
  const groups: Record<string, any[]> = {};
  for (const c of cities) {
    const continent = c.continent || c.country || "Outros";
    if (!groups[continent]) groups[continent] = [];
    groups[continent].push(c);
  }
  return groups;
}

export interface DestinyResultsProps {
  house: number;
  houseName: string;
  houseData: any;
  cities: any;
  allResults?: Record<string, any>;
  onUnlock?: (houses: number) => void;
  userCredits?: number;
  isAuthenticated?: boolean;
  consultationId?: string;
  autoUnlocked?: boolean;
  embedded?: boolean;
  isHouseUnlocked?: (house: number) => boolean;
  onSelectHouse?: (house: number) => void;
  mode?: "passado" | "presente" | "futuro";
  unlockedCount?: number;
}

export const DestinyResults: React.FC<DestinyResultsProps> = ({
  house, cities, autoUnlocked = false, mode = "futuro",
  consultationId, userCredits, isAuthenticated, embedded = false,
  isHouseUnlocked, onSelectHouse, onUnlock, unlockedCount = 1
}) => {
  const { profile } = useAuth();
  const [unlocked] = useState(true);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [videoFailed, setVideoFailed] = useState(false);
  const [wikiImage, setWikiImage] = useState<string | null>(null);

  const atlasData = ATLAS_DO_DESTINO[house] || ATLAS_DO_DESTINO[1];
  const houseDataFull = cityDatabase[house] || cityDatabase[1];
  const allCities = [...(cities.highticket || []), ...(cities.acessivel || []), ...(cities.nacional || [])];
  const secondaryCities = allCities.slice(1);
  const continentGroups = groupCitiesByContinent(secondaryCities);
  const masterCity = allCities[0];
  
  // Data mocks for storytelling
  const currentYear = new Date().getFullYear();
  const targetYear = mode === "futuro" ? currentYear + 1 : currentYear;
  const userName = profile?.full_name?.split(" ")[0] || "Viajante";
  const userFullName = profile?.full_name || "Usuário Solar";
  const returnDate = profile?.birth_date ? profile.birth_date.split("-").reverse().join("/") : "15/03";
  const returnTime = profile?.birth_time ? String(profile.birth_time).slice(0, 5) : "18:42";

  useEffect(() => {
    if (!masterCity) return;
    setVideoFailed(false);
    setWikiImage(null);
    
    const name = masterCity.city || masterCity.display_name || "";
    if (!name) return;

    const fetchWiki = async () => {
      try {
        const ptRes = await fetch(\`https://pt.wikipedia.org/api/rest_v1/page/summary/\${encodeURIComponent(name)}\`);
        if (ptRes.ok) {
          const data = await ptRes.json();
          if (data.type !== "disambiguation" && (data.originalimage?.source || data.thumbnail?.source)) {
            setWikiImage(data.originalimage?.source || data.thumbnail?.source);
            return;
          }
        }
      } catch (e) {
        console.error("Wiki fetch error", e);
      }
    };
    fetchWiki();
  }, [masterCity]);

  if (!masterCity) {
    return (
      <div className="w-full mt-12 p-8 text-center border border-primary/10 bg-primary/5 rounded-2xl backdrop-blur-sm">
        <p className="text-foreground/60 text-sm font-ps-ui">Nenhuma cidade calculada para esta Casa.</p>
      </div>
    );
  }

  const cityName = masterCity.city || masterCity.display_name || "Desconhecido";
  const safeCityName = typeof cityName === 'string' ? cityName : String(cityName || "desconhecido");
  const videoName = safeCityName.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/\\s+/g, "_");
  const fallbackImage = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop";
  const lat = masterCity.lat ? masterCity.lat.toFixed(2) : "0.00";
  const lon = masterCity.lon ? masterCity.lon.toFixed(2) : "0.00";
  const matchScore = masterCity.score || 98;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mt-8 pb-16">

      {/* 1. O TICKET OFICIAL (Certificado de Consulta) */}
      <div className="max-w-4xl mx-auto mb-8 px-4 md:px-0">
        <div className="w-full bg-[#030305]/80 border border-primary/20 rounded-xl p-4 md:p-6 backdrop-blur-md shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[10px] md:text-xs text-primary/70 uppercase tracking-widest">
           <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> <span>Protocolo: #{consultationId?.split('-')[0] || 'RS-9928X'}</span></div>
             <div className="flex items-center gap-2"><User className="w-3 h-3" /> <span>Consulente: {userFullName}</span></div>
           </div>
           <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> <span>Ciclo: Rev. Solar {targetYear} ({mode})</span></div>
             <div className="flex items-center gap-2"><Target className="w-3 h-3" /> <span>Alvo: Casa {house} — {atlasData.title}</span></div>
           </div>
           <div className="flex flex-col gap-2 md:text-right">
             <div className="flex items-center md:justify-end gap-2"><MapPin className="w-3 h-3" /> <span>Ancoragem: {cityName}</span></div>
             <div className="flex items-center md:justify-end gap-2"><Clock className="w-3 h-3" /> <span>Retorno: {returnDate} às {returnTime}</span></div>
           </div>
        </div>
      </div>

      {/* 2. HERO - CINEMATOGRÁFICO, FOCO NA CASA E BRILHANTE */}
      <section className="relative w-full h-[70vh] min-h-[500px] rounded-3xl overflow-hidden mb-12 flex flex-col justify-end group border border-primary/20 shadow-2xl">
        
        {!videoFailed ? (
          <video 
            src={\`/assets/cities/\${videoName}.mp4\`} 
            autoPlay loop muted playsInline
            onError={() => setVideoFailed(true)}
            // REMOVIDA A OPACIDADE ESCURA! Imagem 100% viva e cinematográfica.
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[30s] ease-linear group-hover:scale-105" 
          />
        ) : wikiImage ? (
          <img 
            src={wikiImage} alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[30s] ease-linear group-hover:scale-105" 
          />
        ) : (
          <img 
            src={fallbackImage} alt={cityName} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[30s] ease-linear group-hover:scale-105" 
          />
        )}
        
        {/* GRADIENTE SUAVE APENAS EMBAIXO PARA LEITURA (Fim do "velório") */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/40 to-transparent pointer-events-none h-2/3 mt-auto" />

        <div className="relative z-10 p-6 md:p-12 w-full max-w-5xl mx-auto flex flex-col justify-end h-full">
          
          <div className="flex flex-col items-start mb-6">
            {/* O FOCO É A CASA */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 border border-primary bg-primary/20 text-primary text-xs md:text-sm font-bold uppercase tracking-[0.3em] rounded-full backdrop-blur-md shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              <Sparkles className="w-4 h-4" /> Ativação da Casa {house}
            </span>
            
            <h2 className="font-ps-display text-5xl md:text-7xl lg:text-8xl text-white mb-2 tracking-tight drop-shadow-2xl">
              {cityName}
            </h2>
            
            <div className="flex items-center gap-3 text-white/90 font-mono text-sm tracking-widest uppercase mb-6 drop-shadow-lg bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
              <span className="text-xl -mt-1">{getCountryFlag(masterCity.country)}</span>
              <span className="font-semibold">{masterCity.country}</span>
              <span className="text-primary/70">•</span>
              <span className="text-primary font-bold">{matchScore}% MATCH</span>
            </div>
          </div>

          {/* STORYTELLING HOOK */}
          <div className="max-w-2xl border-l-4 border-primary pl-6 py-2 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-sm rounded-r-2xl">
             <p className="font-ps-ui text-base md:text-lg text-white/90 leading-relaxed font-light drop-shadow-md">
               <strong className="font-bold text-white">{userName}, o seu {targetYear} começa exatamente aqui.</strong><br/>
               O mapa revela que o seu próximo ciclo é regido pela energia da <strong>Casa {house}</strong>. Para destravar {houseDataFull.label || "essa frequência"} com precisão máxima, o universo pede que você ancore o seu Sol neste exato destino.
             </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-0">

        {/* 3. A CIÊNCIA ENVELOPADA EM HISTÓRIA */}
        <section className="mb-16 bg-primary/5 border border-primary/20 rounded-3xl p-8 backdrop-blur-md shadow-xl text-center md:text-left">
           <p className="font-ps-ui text-lg text-foreground/80 leading-relaxed font-light">
             No dia <strong className="text-primary">{returnDate}</strong>, exatamente às <strong className="text-primary">{returnTime}</strong>, o seu Sol retorna à posição exata do seu nascimento. Ao passar este momento milimétrico nas coordenadas <strong>[{lat}° N, {lon}° E]</strong>, a rotação da Terra forçará a ativação magnética da sua Casa {house} para os próximos 365 dias, consolidando <strong className="text-foreground">{matchScore}% de compatibilidade</strong> com a sua intenção.
           </p>
        </section>

        {/* 4. O DIAGNÓSTICO E IMPACTO NA VIDA REAL */}
        <section className="mb-16">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-background/40 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm hover:border-primary/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-ps-display text-2xl text-foreground">Para Quem É</h3>
                 </div>
                 <p className="text-base font-ps-ui text-foreground/80 leading-relaxed font-light">
                    {houseDataFull.forWho || houseDataFull.idealPara || "Mapeado para quem precisa de uma virada radical de foco, assumindo o controle do próprio destino neste novo ciclo de vida."}
                 </p>
              </div>

              <div className="bg-background/40 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm hover:border-primary/30 transition-colors">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-ps-display text-2xl text-foreground">Na Vida Real</h3>
                 </div>
                 <p className="text-base font-ps-ui text-foreground/80 leading-relaxed font-light">
                    {houseDataFull.realLifeImpact || houseDataFull.comoApareceNaVidaReal || "A teoria acaba aqui. Na prática, você sentirá a mudança na forma de tomar decisões, no ritmo do seu dia a dia e nas oportunidades que passam a cruzar o seu caminho."}
                 </p>
              </div>

           </div>
        </section>

        {/* 5. A JORNADA: AS 8 ÁREAS DA VIDA */}
        <section className="mb-16">
           <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/70 block mb-3">
                Mapeamento 360º
              </span>
              <h3 className="font-ps-display text-3xl md:text-4xl text-foreground">As 8 Dimensões do seu Ano</h3>
              <p className="font-ps-ui text-foreground/60 text-sm mt-4 max-w-lg mx-auto">
                Descubra em detalhes como ancorar o seu Sol em {cityName} transformará cada pilar da sua vida pelos próximos 12 meses.
              </p>
           </div>
           
           <Accordion type="single" collapsible className="w-full bg-background/40 border border-primary/10 rounded-3xl p-3 backdrop-blur-md shadow-xl">
              
              <AccordionItem value="identidade" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <User className="w-5 h-5 text-primary" /> Identidade & Autoconhecimento
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.areasDaVida?.['Identidade'] || "Como essa revolução moldará suas atitudes diárias, sua coragem para se impor e a imagem magnética que você projeta no mundo ao seu redor."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="dinheiro" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Wallet className="w-5 h-5 text-primary" /> Finanças & Patrimônio
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.dinheiro || "O impacto prático nas suas fontes de receita. A capacidade de gerar riqueza tangível e a reorganização da sua segurança material ao longo do ciclo."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="trabalho" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Briefcase className="w-5 h-5 text-primary" /> Trabalho & Carreira
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.trabalho || "O cenário do seu ambiente profissional. Aumento de produtividade, novas parcerias de negócios e a abertura de portas que antes pareciam fechadas."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="amor" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Heart className="w-5 h-5 text-primary" /> Amor & Afeto
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.amor || "As frequências afetivas do ano. A atração de pessoas alinhadas com o seu novo momento e o amadurecimento das suas dinâmicas emocionais."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="saude" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Activity className="w-5 h-5 text-primary" /> Saúde & Vitalidade
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.vidaPessoal || "O nível da sua bateria interna. Como essa coordenada afeta a sua disposição física e a força para estruturar novos hábitos de cuidado corporal."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="networking" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Users className="w-5 h-5 text-primary" /> Networking & Alianças
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.areasDaVida?.['Social'] || "A sua capacidade de se conectar com pessoas estratégicas, atrair mentores, clientes influentes e consolidar sua presença social no mercado."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rotina" className="border-b border-primary/10 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Map className="w-5 h-5 text-primary" /> Rotina & Cotidiano
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.comoAproveitar || "A forma prática como seus dias serão desenhados. Eliminação da sobrecarga mental e estruturação de uma agenda focada no que realmente importa."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="espiritualidade" className="border-b-0 px-4">
                <AccordionTrigger className="text-foreground hover:no-underline py-5 opacity-90 hover:opacity-100">
                   <span className="font-ps-display text-lg tracking-wide flex items-center gap-3">
                     <Sparkles className="w-5 h-5 text-primary" /> Espiritualidade & Energia
                   </span>
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 font-ps-ui text-base leading-relaxed pb-6 font-light px-2">
                   {houseDataFull.areasDaVida?.['Espiritual'] || "A força da sua intuição. O alinhamento com os seus propósitos mais profundos e o fechamento necessário de velhos ciclos emocionais."}
                </AccordionContent>
              </AccordionItem>
           </Accordion>
        </section>

        {/* 6. O PLANO TÁTICO (RITUAL & MANTRA) */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 md:p-10 relative overflow-hidden backdrop-blur-sm shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                 <Clock className="w-40 h-40 text-primary" />
              </div>
              <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] text-primary mb-3 font-bold">O Guia de Ancoragem</h4>
              <h3 className="font-ps-display text-3xl text-foreground mb-4 drop-shadow-md">O Ritual das 24 Horas</h3>
              <p className="font-ps-ui text-foreground/90 leading-relaxed mb-8 font-light relative z-10 text-lg">
                 {houseDataFull.ritual24h || "Reserve o dia do seu aniversário para mentalizar as mudanças deste ciclo e desconectar de ruídos externos. Execute o que a energia da cidade pede logo nas primeiras horas."}
              </p>
              
              <div className="border-t border-primary/20 pt-8 relative z-10">
                 <span className="text-[10px] uppercase tracking-[0.2em] text-primary/70 block mb-3 font-bold flex items-center gap-2">
                    <Compass className="w-3 h-3" /> Mantra do Ciclo
                 </span>
                 <p className="font-ps-display text-2xl md:text-3xl text-primary italic drop-shadow-lg leading-tight">
                    "{houseDataFull.mantra || "Eu assumo o controle da minha realidade e ativo a mudança."}"
                 </p>
              </div>
           </div>

           <div className="bg-background/40 border border-primary/10 rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                   <Calendar className="w-5 h-5 text-primary" />
                 </div>
                 <h3 className="font-ps-display text-2xl text-foreground">Timeline</h3>
              </div>
              <div className="space-y-6">
                 <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold block mb-1">Mês 1-3</span>
                    <p className="text-sm font-ps-ui text-foreground/70 font-light">Adaptação, desconstrução de hábitos antigos e novos inícios.</p>
                 </div>
                 <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary/80 font-bold block mb-1">Mês 4-8</span>
                    <p className="text-sm font-ps-ui text-foreground/70 font-light">Pico de energia. Momento ideal para agir e focar em resultados tangíveis.</p>
                 </div>
                 <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold block mb-1">Mês 9-12</span>
                    <p className="text-sm font-ps-ui text-foreground/70 font-light">Consolidação e colheita do que foi plantado. Preparação para o próximo ciclo.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* 7. MASTERCLASS VIP */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-ps-display text-2xl md:text-3xl text-foreground">Masterclass VIP</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          <div className="bg-background/50 border border-primary/10 rounded-3xl p-4 md:p-8 shadow-2xl backdrop-blur-xl">
            {/* VIDEO MOCK */}
            <div className="w-full aspect-video bg-black/40 rounded-2xl border border-primary/10 relative overflow-hidden group cursor-pointer flex items-center justify-center mb-6 shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="flex flex-col items-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-background/60 backdrop-blur-md flex items-center justify-center mb-4 border border-primary/30 group-hover:scale-110 transition-transform shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                     <PlayCircle className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <span className="text-foreground/90 text-xs font-ps-ui uppercase tracking-widest font-semibold drop-shadow-md">Desbloquear Masterclass</span>
               </div>
            </div>

            {/* DOWNLOADS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button className="flex items-center justify-between p-5 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors group">
                  <div className="text-left">
                     <h4 className="text-foreground font-ps-display tracking-wide mb-1">Guia de Revolução</h4>
                     <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Baixar PDF</span>
                  </div>
                  <Download className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
               </button>

               <button className="flex items-center justify-between p-5 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors group">
                  <div className="text-left">
                     <h4 className="text-foreground font-ps-display tracking-wide mb-1">Ritual das 24 Horas</h4>
                     <span className="text-[10px] text-primary uppercase tracking-widest font-bold">Baixar PDF</span>
                  </div>
                  <Download className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors" />
               </button>
            </div>
          </div>
        </section>

        {/* 8. DESTINOS SECUNDÁRIOS COM % DE MATCH */}
        {secondaryCities.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-ps-display text-2xl md:text-3xl text-foreground">Rotas Alternativas</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
            </div>
            <p className="text-foreground/70 font-ps-ui text-base mb-10 font-light max-w-2xl">
              Se o seu Destino Mestre não for viável, o algoritmo separou estas coordenadas secundárias que também ativam a energia da Casa {house}, preservando alta compatibilidade.
            </p>

            <div className="grid gap-8">
              {Object.entries(continentGroups).map(([continent, citiesList]) => (
                <div key={continent}>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-5 pl-2 border-l-2 border-primary/50">
                    {continent}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {citiesList.map((c, i) => {
                       // Generate a fallback descending score if none exists
                       const localScore = c.score || Math.max(85, matchScore - (i + 1) * 3);
                       return (
                         <div key={i} className="bg-background/40 border border-primary/10 rounded-2xl p-5 hover:border-primary/40 transition-all relative overflow-hidden backdrop-blur-sm group flex flex-col justify-between h-full">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                              <MapPin className="w-6 h-6 text-primary" />
                           </div>
                           
                           <div>
                             <div className="flex items-center justify-between mb-3 relative z-10">
                               <div className="flex items-center gap-2">
                                 <span className="text-2xl drop-shadow-md">{getCountryFlag(c.country)}</span>
                                 <span className="text-[9px] text-foreground/50 uppercase tracking-widest font-semibold">{c.country}</span>
                               </div>
                             </div>
                             
                             <p className="text-foreground font-ps-display text-lg leading-tight relative z-10 drop-shadow-sm mb-1">{c.city || c.display_name}</p>
                             
                             {c.lat != null && c.lon != null && (
                               <p className="text-foreground/40 text-[10px] font-mono relative z-10 mb-4">
                                 {c.lat.toFixed(2)}°, {c.lon.toFixed(2)}°
                               </p>
                             )}
                           </div>

                           <div className="mt-auto pt-3 border-t border-primary/10 relative z-10">
                              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-md font-mono tracking-wider">
                                {localScore}% MATCH
                              </span>
                           </div>
                         </div>
                       );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. VISÃO COMPLETA (GRADE DE 12 CASAS) */}
        {!embedded && (
          <section className="border-t border-primary/20 pt-16 mt-16 mb-8">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/50 block mb-3">
                A Jornada Completa
              </span>
              <h3 className="font-ps-display text-3xl text-foreground">O Mapa das 12 Coordenadas</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
              {Object.values(cityDatabase).map((houseItem) => {
                const isCurrentHouse = houseItem.id === house;
                const isUnlocked = isHouseUnlocked ? isHouseUnlocked(houseItem.id) : (isCurrentHouse || autoUnlocked);

                return (
                  <div
                    key={houseItem.id}
                    onClick={() => {
                      if (!isUnlocked) {
                        if (onUnlock) onUnlock(houseItem.id);
                      } else if (onSelectHouse && !isCurrentHouse) {
                        onSelectHouse(houseItem.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={\`relative flex items-center p-4 rounded-xl border transition-all \${!isCurrentHouse ? "cursor-pointer" : ""} \${
                      isCurrentHouse
                        ? "bg-primary/20 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                        : "bg-background/40 border-primary/10 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-sm"
                    }\`}
                  >
                    <div className="flex flex-col flex-1 truncate">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={\`text-[10px] font-mono font-bold tracking-widest \${isCurrentHouse ? "text-primary drop-shadow-sm" : "text-muted-foreground"}\`}>
                          CASA {String(houseItem.id).padStart(2, "0")}
                        </span>
                      </div>
                      <span className={\`text-sm font-ps-display truncate \${isCurrentHouse ? "text-foreground" : (isUnlocked ? "text-foreground/90" : "text-muted-foreground")}\`}>
                        {houseItem.label}
                      </span>
                    </div>

                    <div className="shrink-0 ml-3">
                      {isCurrentHouse ? (
                        <CheckCircle2 className="w-5 h-5 text-primary drop-shadow-md" />
                      ) : !isUnlocked ? (
                        <Lock className="w-4 h-4 text-muted-foreground/40" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default DestinyResults;
`;

fs.writeFileSync(file, content);
console.log("DestinyResults fully rewritten with narrative storytelling.");
