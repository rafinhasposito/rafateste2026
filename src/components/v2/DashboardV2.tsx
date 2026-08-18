import React from "react";
import { dashboardData } from "@/data/houseDashboardData";
import { Compass, AlertTriangle, Route } from "lucide-react";

interface DashboardV2Props {
  house: any;
}

export function DashboardV2({ house }: DashboardV2Props) {
  const score = 9.1; // Fixo para visual por enquanto, baseado no "Excellent" do IDEA CASAS
  
  return (
    <div className="flex flex-col gap-6 px-4 pb-12 pt-4">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Seu Dossiê</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Casa {house.id} • {house.name}</p>
      </div>

      {/* Score Card (Baseado no IDEA CASAS) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinergia</span>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest">Excelente</span>
        </div>
        
        {/* Gauge Arc Mock */}
        <div className="relative w-48 h-24 overflow-hidden mb-2">
           <div className="absolute w-48 h-48 rounded-full border-[12px] border-slate-100 border-b-transparent border-r-transparent rotate-45"></div>
           <div className={`absolute w-48 h-48 rounded-full border-[12px] ${house.border || 'border-indigo-500'} border-b-transparent border-r-transparent rotate-45`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 80%)' }}></div>
           
           <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-end pb-2">
             <span className={`text-5xl font-black ${house.color}`}>{score}</span>
           </div>
        </div>
        <p className="text-xs font-bold text-slate-400">Score de Afinidade</p>
      </div>

      {/* Conselho Cósmico */}
      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
         <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-black text-amber-700 uppercase tracking-widest">Conselho Cósmico</h3>
         </div>
         <p className="text-amber-900 font-medium text-sm leading-relaxed">
            {house.cosmicAdvice}
         </p>
      </div>

      {/* Roadmap */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
         <div className="flex items-center gap-2 mb-6">
            <Route className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Roadmap 12 Meses</h3>
         </div>
         
         <div className="flex flex-col gap-6 relative before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-slate-100">
            {house.roadmap.map((step: any, idx: number) => (
              <div key={idx} className="flex gap-4 relative z-10">
                 <div className={`w-6 h-6 rounded-full ${house.bg} shrink-0 flex items-center justify-center text-white text-[10px] font-black border-4 border-white shadow-sm`}>
                   {idx + 1}
                 </div>
                 <div className="flex flex-col pt-1">
                   <h4 className="text-sm font-bold text-slate-900 mb-1">{step.phase}</h4>
                   <p className="text-xs font-medium text-slate-500 leading-relaxed">{step.action}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
      
      {/* Botão de Ação Final */}
      <button className={`w-full py-5 rounded-2xl ${house.bg} text-white font-black shadow-lg hover:shadow-xl transition-all uppercase tracking-widest text-sm mt-4`}>
        Sincronizar Destino
      </button>

    </div>
  );
}
