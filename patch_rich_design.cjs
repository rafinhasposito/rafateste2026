const fs = require('fs');
const file = 'src/pages/Technology.tsx';

const content = `import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Orbit, Cpu, Globe, ShieldCheck, Database, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Technology = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* BACKGROUND EFFECTS: Mesh Gradients & Noise */}
      <motion.div 
        style={{ y: yBackground }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen" />
        {/* Subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
      </motion.div>

      {/* HEADER NAVBAR */}
      <div className="relative z-50 w-full max-w-7xl mx-auto px-6 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-white/50 hover:text-white transition-all duration-300 w-fit backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-[0.2em]">Retornar</span>
        </button>
      </div>

      {/* HERO SECTION - CINEMATIC */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-20 animate-pulse" />
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full text-xs uppercase font-bold tracking-[0.3em] text-white/80 relative z-10">
            <Zap className="w-4 h-4 text-indigo-400" />
            Engenharia do Destino
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-ps-display font-bold tracking-tighter mb-8 leading-[1.1]"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/30">
            Muito além do 
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-white italic pr-4">
            Misticismo.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-2xl text-white/50 max-w-3xl font-light leading-relaxed"
        >
          O Protocolo Solar não é um horóscopo genérico. É um <strong className="text-white font-medium">motor astrométrico</strong> que varre o globo terrestre processando as mesmas efemérides matemáticas utilizadas por agências espaciais.
        </motion.p>
      </section>

      {/* STORYTELLING TIMELINE (THE 3 STEPS) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-40">
        <div className="absolute left-[50px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 hidden md:block" />

        <div className="space-y-24 md:space-y-40">
          {/* STEP 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-10 md:gap-20"
          >
            <div className="md:w-1/2 flex justify-end relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                <Orbit className="w-12 h-12 md:w-16 md:h-16 text-indigo-300/80" />
              </div>
              <span className="absolute -top-10 -right-10 md:right-10 text-[150px] font-ps-display font-bold text-white/[0.02] select-none pointer-events-none">01</span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl md:text-5xl font-ps-display text-white mb-6">Mapeamento <br/><span className="text-indigo-300">Natal</span></h3>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                Utilizamos as tabelas planetárias da NASA (JPL DE431) para escanear e fixar a posição exata do Sol no milissegundo do seu nascimento, garantindo a sua assinatura genética celeste com erro zero.
              </p>
            </div>
          </motion.div>

          {/* STEP 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-20"
          >
            <div className="md:w-1/2 flex justify-start relative">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                <Cpu className="w-12 h-12 md:w-16 md:h-16 text-purple-300/80" />
              </div>
              <span className="absolute -top-10 -left-10 md:left-10 text-[150px] font-ps-display font-bold text-white/[0.02] select-none pointer-events-none">02</span>
            </div>
            <div className="md:w-1/2 md:text-right">
              <h3 className="text-3xl md:text-5xl font-ps-display text-white mb-6">Cálculo de <br/><span className="text-purple-300">Retorno</span></h3>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                Nossos servidores processam o tempo futuro para descobrir o exato momento (convertido para o fuso UTC) em que o Sol cruzará a sua coordenada natal novamente. Este é o marco zero da Revolução.
              </p>
            </div>
          </motion.div>

          {/* STEP 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-10 md:gap-20"
          >
            <div className="md:w-1/2 flex justify-end relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl flex items-center justify-center relative z-10 shadow-[0_0_80px_rgba(59,130,246,0.2)]">
                <Globe className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <span className="absolute -top-10 -right-10 md:right-10 text-[150px] font-ps-display font-bold text-white/[0.02] select-none pointer-events-none">03</span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl md:text-5xl font-ps-display text-white mb-6">Varredura <br/><span className="text-blue-300">Geométrica</span></h3>
              <p className="text-lg text-white/50 font-light leading-relaxed">
                Com o momento temporal cravado, a inteligência artificial testa milhares de coordenadas na Terra simultaneamente. O objetivo? Encontrar a geografia perfeita que força as Casas Astrológicas a se alinharem ao seu Desejo.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENTO BOX - TECH SPECS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Large Main Box */}
          <motion.div 
            whileHover={{ scale: 0.99 }}
            className="md:col-span-2 bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.08] backdrop-blur-2xl p-10 md:p-16 rounded-[2rem] relative overflow-hidden"
          >
            <div className="absolute -right-20 -bottom-20 opacity-20">
              <ShieldCheck className="w-80 h-80 text-white" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/80 mb-6 border border-white/5">
                <Database className="w-3 h-3" /> Padrão Ouro
              </div>
              <h3 className="text-4xl md:text-5xl font-ps-display text-white mb-6">Certificação<br/>Suíça (Astrodienst)</h3>
              <p className="text-lg text-white/50 leading-relaxed font-light max-w-lg">
                Nós não inventamos a matemática celeste, nós escalamos o padrão mais rigoroso do mundo. O núcleo do Protocolo Solar roda sobre a <strong>swisseph</strong>, garantindo que o seu ticket aéreo não seja comprado com base em suposições geométricas.
              </p>
            </div>
          </motion.div>

          {/* Small Boxes */}
          <div className="flex flex-col gap-6">
            <motion.div whileHover={{ scale: 0.98 }} className="flex-1 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-[2rem] flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Astrometria Engine</span>
              <span className="text-2xl font-mono text-white tracking-widest">JPL DE431</span>
              <div className="mt-4 h-1 w-12 bg-indigo-500/50 rounded-full" />
            </motion.div>
            <motion.div whileHover={{ scale: 0.98 }} className="flex-1 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl p-8 rounded-[2rem] flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Acurácia de Cálculo</span>
              <span className="text-2xl font-mono text-white tracking-widest">&lt; 0.001"</span>
              <div className="mt-4 h-1 w-12 bg-purple-500/50 rounded-full" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION - GLASSMORPHISM ACCORDION */}
      <section className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-ps-display text-white mb-6">Dúvidas Frequentes</h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
            <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
              Por que eu preciso viajar fisicamente para o destino?
            </AccordionTrigger>
            <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
              A geometria do céu muda drasticamente dependendo do ponto da Terra onde você está. Ao mudar sua coordenada geográfica no exato milissegundo do seu aniversário, você obriga o céu a "imprimir" um mapa arquitetural completamente novo para o seu próximo ano de vida. Você altera a perspectiva do radar planetário.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
            <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
              Quanto tempo eu preciso ficar no local?
            </AccordionTrigger>
            <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
              Você não precisa se mudar para lá. O "carimbo cósmico" acontece em um instante temporal. Recomendamos o "Ritual das 24 Horas": chegue na véspera, passe o minuto exato da ancoragem no destino, e você já está livre para retornar para a sua base natal com o seu novo mapa ativado.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-none bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 backdrop-blur-md overflow-hidden">
            <AccordionTrigger className="text-white hover:text-white/80 hover:no-underline py-6 font-ps-display text-xl tracking-wide text-left">
              O sistema funciona para analisar anos passados?
            </AccordionTrigger>
            <AccordionContent className="text-white/50 text-base leading-relaxed pb-6 font-light">
              Sim, e essa é uma das provas mais assustadoras da precisão do sistema. Faça uma busca reversa: insira o ano e a cidade em que você passou um aniversário marcante no passado. O sistema vai revelar exatamente qual Casa você ativou naquele ano, e você verá as características dela espelhadas nos eventos que você viveu.
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
console.log("Completely redesigned Technology.tsx with rich glassmorphism, storytelling timeline, and cinematic effects.");
