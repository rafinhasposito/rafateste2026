import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield } from "lucide-react";

interface QuizV2Props {
  house: any;
  onComplete: () => void;
}

export function QuizV2({ house, onComplete }: QuizV2Props) {
  return (
    <div className="flex flex-col h-full min-h-[85dvh] justify-center px-6 relative">
      <div className="absolute inset-0 bg-slate-900 overflow-hidden rounded-3xl -z-10">
         <div className={`absolute -top-[20%] -right-[20%] w-96 h-96 ${house.bg} rounded-full blur-[100px] opacity-20`} />
         <div className={`absolute -bottom-[20%] -left-[20%] w-96 h-96 ${house.bg} rounded-full blur-[100px] opacity-20`} />
      </div>

      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className={`w-16 h-16 rounded-2xl ${house.bg} mx-auto mb-6 flex items-center justify-center text-white shadow-lg`}
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        <h2 className="text-3xl font-black text-white leading-tight mb-4">
          Para ativar o modo<br/>
          <span className={house.color}>{house.archetype || house.name}</span>
        </h2>
        <p className="text-slate-400 font-medium">
          O Universo precisa saber o seu estado atual.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-white/20 transition-all text-white group"
        >
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all">
             <Shield className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-black mb-1">Modo Caos</h3>
            <p className="text-xs text-slate-400 font-medium">Estou exausto, preciso de ordem, proteção e resgate das minhas raízes.</p>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-white/20 transition-all text-white group"
        >
          <div className={`w-12 h-12 rounded-full ${house.bg}/20 ${house.color} flex items-center justify-center group-hover:${house.bg} group-hover:text-white transition-all`}>
             <Zap className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-black mb-1">Modo Escala</h3>
            <p className="text-xs text-slate-400 font-medium">Estou estruturado. Quero acelerar, dominar e multiplicar meus resultados.</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
