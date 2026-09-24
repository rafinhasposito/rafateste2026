const fs = require('fs');
const file = 'src/pages/Technology.tsx';

const content = `import React from 'react';
import { motion } from 'framer-motion';
import { Satellite, Orbit, Cpu, Globe, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';

const Technology = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#0B1120] pb-32 selection:bg-sky-500/30">
      {/* HEADER SIMPLES DE NAVEGAÇÃO */}
      <div className="w-full max-w-6xl mx-auto px-6 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sky-400/70 hover:text-sky-300 transition-colors text-xs font-mono uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto px-6 mb-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center text-center relative z-10 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-sky-500/20 bg-sky-500/10 rounded-full text-[10px] md:text-xs uppercase font-bold tracking-[0.3em] text-sky-400 mb-8">
            <Satellite className="w-4 h-4" />
            Transparência Tecnológica
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-ps-display text-slate-50 mb-8 tracking-tight drop-shadow-lg">
            O Motor Astrológico <br />
            <span className="text-sky-400 italic">de Alta Precisão</span>
          </h1>
          
          <p className="text-slate-400 font-ps-ui text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Não entregamos horóscopos genéricos ou palpites místicos. O Protocolo Solar é alimentado pela 
            <strong className="text-slate-100 font-semibold mx-1">Swiss Ephemeris</strong> — o mesmo padrão de cálculo astrométrico utilizado por laboratórios globais para mapear a posição exata dos corpos celestes.
          </p>
        </div>
      </section>

      {/* THE 3-STEP ENGINE - SYMMETRICAL GRID */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-ps-display text-slate-50">A Arquitetura do Cálculo</h2>
          <div className="w-16 h-px bg-sky-500/30 mx-auto mt-6" />
        </div>

        {/* PERFECT 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Step 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#111827] border border-slate-800 hover:border-sky-900/50 p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col items-center text-center transition-colors h-full shadow-lg"
          >
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Orbit className="w-8 h-8 text-sky-400" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold mb-3">Passo 01</span>
            <h3 className="text-2xl font-ps-display text-slate-100 mb-4">Mapeamento Natal</h3>
            <p className="text-sm font-ps-ui text-slate-400 leading-relaxed font-light">
              Utilizamos as efemérides JPL DE431 da NASA para definir a posição exata do Sol no seu momento de nascimento, com precisão de frações de arco de segundo.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#111827] border border-slate-800 hover:border-sky-900/50 p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col items-center text-center transition-colors h-full shadow-lg"
          >
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Cpu className="w-8 h-8 text-sky-400" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold mb-3">Passo 02</span>
            <h3 className="text-2xl font-ps-display text-slate-100 mb-4">Retorno Milimétrico</h3>
            <p className="text-sm font-ps-ui text-slate-400 leading-relaxed font-light">
              Com o alvo travado, calculamos o momento exato em que o Sol retorna à coordenada de origem. O marco zero da sua Revolução Solar convertido para o fuso UTC Universal.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#111827] border border-slate-800 hover:border-sky-900/50 p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col items-center text-center transition-colors h-full shadow-lg"
          >
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Globe className="w-8 h-8 text-sky-400" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold mb-3">Passo 03</span>
            <h3 className="text-2xl font-ps-display text-slate-100 mb-4">Varredura Global</h3>
            <p className="text-sm font-ps-ui text-slate-400 leading-relaxed font-light">
              Nossa I.A. varre o globo terrestre e testa milhares de coordenadas para encontrar onde você precisa estar fisicamente para ancorar o resultado desejado.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DADOS TÉCNICOS / VALIDATION - SYMMETRICAL */}
      <section className="max-w-5xl mx-auto px-6 mb-32">
        <div className="bg-[#0D1528] border border-sky-900/20 p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-col items-center text-center mb-12 relative z-10">
            <ShieldCheck className="w-12 h-12 text-sky-400 mb-6 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]" />
            <h3 className="text-3xl md:text-4xl font-ps-display text-slate-50 mb-6">Certificação Suíça</h3>
            <p className="text-slate-400 font-ps-ui leading-relaxed font-light text-base max-w-3xl">
              Todo Protocolo Solar é alimentado pela biblioteca nativa <strong>swisseph</strong>. Desenvolvida originalmente pelo Astrodienst, ela garante que não exista margem de erro. A compatibilidade de 98% baseia-se na física celeste exigida pela astronomia moderna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto relative z-10">
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-sky-400/70 mb-2">Astrometria</span>
              <span className="text-base font-mono text-slate-100 tracking-widest">JPL DE431</span>
            </div>
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-sky-400/70 mb-2">Algoritmo</span>
              <span className="text-base font-mono text-slate-100 tracking-widest">Swiss Ephemeris</span>
            </div>
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-sky-400/70 mb-2">Acurácia</span>
              <span className="text-base font-mono text-slate-100 tracking-widest">&lt; 0.001 ARCSEC</span>
            </div>
          </div>
          
        </div>
      </section>

      {/* FAQ SECTION - SYMMETRICAL */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-sky-400/70 block mb-3">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl md:text-5xl font-ps-display text-slate-50">Central de Inteligência</h2>
        </div>

        <Accordion type="single" collapsible className="w-full bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <AccordionItem value="item-1" className="border-b border-slate-800/50 px-4">
            <AccordionTrigger className="text-slate-100 hover:text-sky-300 hover:no-underline py-6 font-ps-display text-lg md:text-xl tracking-wide text-left">
              Por que eu preciso viajar fisicamente para o destino?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 font-ps-ui text-base leading-relaxed pb-6 font-light">
              Porque a astrologia funciona com base na latitude e longitude. A geometria do céu (o sistema de Casas) muda drasticamente dependendo do ponto da Terra onde você está. Ao mudar sua coordenada geográfica no momento milimétrico em que o Sol retorna, você força o céu a "imprimir" um novo mapa no seu próximo ano de vida.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-b border-slate-800/50 px-4">
            <AccordionTrigger className="text-slate-100 hover:text-sky-300 hover:no-underline py-6 font-ps-display text-lg md:text-xl tracking-wide text-left">
              Quanto tempo eu preciso ficar no local?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 font-ps-ui text-base leading-relaxed pb-6 font-light">
              O Protocolo Solar não exige que você se mude permanentemente ou tire 30 dias de férias. O "carimbo cósmico" acontece no exato milissegundo do seu Retorno Solar. Recomendamos o "Ritual das 24 Horas": chegue um dia antes, passe o momento exato no destino para garantir a ancoragem da energia, e você já está livre para retornar à sua base logo depois.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-b border-slate-800/50 px-4">
            <AccordionTrigger className="text-slate-100 hover:text-sky-300 hover:no-underline py-6 font-ps-display text-lg md:text-xl tracking-wide text-left">
              E se for impossível viajar para o Destino Ideal?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 font-ps-ui text-base leading-relaxed pb-6 font-light">
              Não se preocupe. O nosso algoritmo não cospe apenas uma cidade. Ele faz uma varredura global e gera uma lista de "Destinos Secundários". Muitas vezes, uma cidade a algumas horas de carro de você pode garantir 95% de compatibilidade matemática com o seu foco, substituindo o Destino Ideal de 99% (que pode estar do outro lado do mundo).
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-b-0 px-4">
            <AccordionTrigger className="text-slate-100 hover:text-sky-300 hover:no-underline py-6 font-ps-display text-lg md:text-xl tracking-wide text-left">
              O sistema funciona para investigar o Passado?
            </AccordionTrigger>
            <AccordionContent className="text-slate-400 font-ps-ui text-base leading-relaxed pb-6 font-light">
              Sim. Uma das formas mais impactantes de provar a eficiência da ferramenta é realizar uma busca reversa. Consulte anos passados em que você passou seu aniversário fora da sua base, e veja matematicamente qual Casa você ativou. Você perceberá rapidamente que aquele ano espelhou exatamente as qualidades do Protocolo calculado.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      
    </div>
  );
};

export default Technology;
`;

fs.writeFileSync(file, content);
console.log("Applied Blue/Silver color palette to Technology.tsx");
