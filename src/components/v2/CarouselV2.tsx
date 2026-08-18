import React from "react";
import { motion } from "framer-motion";
import { dashboardData } from "@/data/houseDashboardData";
import { ChevronRight } from "lucide-react";

interface CarouselV2Props {
  onSelect: (id: number) => void;
}

export function CarouselV2({ onSelect }: CarouselV2Props) {
  const houses = Object.keys(dashboardData).map(k => dashboardData[Number(k)]).sort((a,b) => a.id - b.id);

  return (
    <div className="flex flex-col gap-6 px-4 pb-8">
      <div className="pt-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Descubra sua<br/>Jornada Solar</h1>
        <p className="text-slate-500 font-medium text-sm">Qual energia você precisa para escalar neste ciclo?</p>
      </div>

      <div className="flex flex-col gap-6">
        {houses.map(house => (
          <motion.div
            key={house.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(house.id)}
            className="w-full relative h-[380px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg group"
          >
            {/* Background Image / Color */}
            <div className={`absolute inset-0 ${house.bg} flex items-end justify-center`}>
              <img src={house.memoji} alt={house.name} className="w-[120%] h-[120%] object-cover object-top opacity-80 mix-blend-luminosity group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="self-end bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                 <span className="text-white text-xs font-black uppercase tracking-widest">Casa {house.id}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-black text-white leading-tight drop-shadow-md">
                  {house.name}
                </h2>
                <div className="flex items-center justify-between">
                  <p className="text-white/80 text-xs font-medium w-3/4 line-clamp-2">
                    {house.headline}
                  </p>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-md">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
