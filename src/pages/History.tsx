import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint, MapPin, Search, Compass, Scroll, Crown, ChevronRight } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import { cityDatabase } from "@/data/houses";
import { BackButton } from "@/components/ui/BackButton";

interface ConsultationRow {
  id: string;
  name: string;
  created_at: string;
  mode: string;
  goal: number | null;
  intent: string | null;
  origin: string | null;
  houses_unlocked: number;
}


const intentMap: Record<string, string> = {
  amor: "Amor e Relacionamento",
  trabalho: "Trabalho e Carreira",
  dinheiro: "Dinheiro e Recursos",
  saude: "Saúde e Vitalidade",
  networking: "Networking e Conexões",
  rotina: "Rotina e Produtividade",
  espiritual: "Espiritual e Propósito",
  identidade: "Identidade e Imagem"
};

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("consultations")
          .select("id, name, created_at, mode, goal, intent, origin, houses_unlocked")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setConsultations(data as ConsultationRow[]);
      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const getHoverStyles = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "passado":
        return {
          border: "hover:border-[#94A3B8]/40",
          glow: "bg-[#94A3B8]/5 group-hover:bg-[#94A3B8]/15"
        };
      case "presente":
        return {
          border: "hover:border-[#10B981]/40",
          glow: "bg-[#10B981]/5 group-hover:bg-[#10B981]/15"
        };
      case "futuro":
      default:
        return {
          border: "hover:border-[#C9A227]/40",
          glow: "bg-[#C9A227]/5 group-hover:bg-[#C9A227]/15"
        };
    }
  };

  const getModeStyles = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "passado":
        return "text-[#E2E8F0] border-[#94A3B8]/35 bg-[#94A3B8]/12";
      case "presente":
        return "text-[#A7F3D0] border-[#10B981]/35 bg-[#10B981]/12";
      case "futuro":
      default:
        return "text-[#F5DE98] border-[#C9A227]/35 bg-[#C9A227]/12";
    }
  };

  return (
    <div className="min-h-screen text-ps-text font-ps-ui selection:bg-ps-gold/30">
      <div className="pt-20 lg:pt-10 pb-28 lg:pb-16 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto relative z-10">
        <div className="hidden lg:block mb-6">
          <BackButton label="Descobrir" to="/" />
        </div>

        <div className="mb-10">
          <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-semibold text-[#F5DE98]/80 mb-2">
            Histórico Pessoal
          </span>
          <h1 className="font-ps-display text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-3 tracking-tight">
            Suas Consultas
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-2xl leading-relaxed">
            Revise todos os mapas e cidades que você já calculou. Suas leituras ficam salvas para você comparar destinos sempre que quiser.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <Loader2 className="w-8 h-8 text-[#C9A227] animate-spin" />
            <p className="text-[#F5DE98] text-xs uppercase tracking-widest font-semibold animate-pulse">Carregando suas consultas...</p>
          </div>
        ) : consultations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center py-20 px-6 bg-[#08111F]/90 border border-[#C9A227]/20 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Compass className="w-14 h-14 text-[#F5DE98]/70 mb-5" />
            <h2 className="font-ps-display text-2xl sm:text-3xl text-white font-bold mb-3">Você ainda não fez nenhuma consulta</h2>
            <p className="text-white/60 text-sm mb-8 max-w-md leading-relaxed">Descubra qual cidade ativa a melhor área da sua vida no seu próximo aniversário.</p>
            <button onClick={() => navigate("/")} className="px-8 py-4 bg-[#C9A227] text-[#02050A] hover:bg-[#E5C158] transition-all rounded-xl text-xs uppercase tracking-widest font-bold shadow-[0_10px_28px_rgba(201,162,39,0.28)]">
              Fazer Minha Primeira Consulta
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {consultations.map((c, i) => {
              const modeLabel = c.mode?.toLowerCase() || "futuro";
              const hasOrigin = !!c.origin;
              const houseData = c.goal ? cityDatabase[c.goal] : null;
              
              let MethodIcon = Crown;
              let methodLabel = "Por Área da Vida";
              if (hasOrigin) {
                MethodIcon = Compass;
                methodLabel = "Por Cidade";
              }
              
              const hoverStyles = getHoverStyles(modeLabel);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  onClick={() => navigate(`/dashboard?id=${c.id}`)}
                  className={`group bg-[#08111F]/90 backdrop-blur-xl border border-white/[0.08] ${hoverStyles.border} rounded-3xl p-6 md:p-8 transition-all duration-400 hover:-translate-y-1 cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.45)]`}
                >
                  <div className={`absolute top-0 right-0 w-36 h-36 blur-3xl rounded-full pointer-events-none transition-colors duration-700 ${hoverStyles.glow}`}></div>
                  
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1 rounded-full border ${getModeStyles(modeLabel)}`}>
                          {modeLabel.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 border border-white/10 bg-white/[0.03] text-white/60 text-[10px] uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 font-medium">
                          <MethodIcon className="w-3 h-3" />
                          {methodLabel}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-white/55 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                        {c.houses_unlocked} {c.houses_unlocked === 1 ? 'Casa aberta' : 'Casas abertas'}
                      </div>
                    </div>

                    <h3 className="font-ps-display text-2xl md:text-3xl text-white font-bold mb-3 group-hover:text-[#F5DE98] transition-colors duration-300 line-clamp-1">
                      {c.name || "Consulta Pessoal"}
                    </h3>

                    {/* Renderização de Foco e Origem */}
                    <div className="mb-6">
                      {(() => {
                         const displayIntent = c.intent ? (intentMap[c.intent.toLowerCase()] || c.intent) : "Leitura Completa";
                         
                         if (hasOrigin) {
                           return (
                             <div className="flex flex-col gap-1.5">
                               <p className="font-ps-ui text-sm text-white/85 leading-relaxed">
                                 <span className="text-white/50">Cidade:</span> {c.origin} <span className="text-white/25 mx-1">•</span> Casa {c.goal} <span className="text-white/50 ml-1">({displayIntent})</span>
                               </p>
                               {houseData?.tag && (
                                 <p className="text-[#F5DE98]/75 text-[10px] uppercase tracking-[0.16em] flex items-center gap-1.5 font-medium">
                                   <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] inline-block"></span>
                                   Tema da Casa {c.goal}: {houseData.tag}
                                 </p>
                               )}
                             </div>
                           );
                         } else {
                           return (
                             <div className="flex flex-col gap-1.5">
                               <p className="font-ps-ui text-sm text-white/85 leading-relaxed">
                                 <span className="text-white/50">Área escolhida:</span> {displayIntent} <span className="text-white/25 mx-1">•</span> Casa {c.goal}
                               </p>
                               {houseData?.tag && (
                                 <p className="text-[#F5DE98]/75 text-[10px] uppercase tracking-[0.16em] flex items-center gap-1.5 font-medium">
                                   <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] inline-block"></span>
                                   Tema da Casa {c.goal}: {houseData.tag}
                                 </p>
                               )}
                             </div>
                           );
                         }
                      })()}
                    </div>

                    <div className="mb-6">
                      <p className="flex items-center gap-2.5 text-white/50 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-white/35" /> 
                        Consultado em <span className="text-white/75">{formatDate(c.created_at)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[#F5DE98] text-xs font-medium group-hover:underline underline-offset-4">
                      Abrir leitura completa
                    </span>

                    <div className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/60 group-hover:bg-[#C9A227] group-hover:border-[#C9A227] group-hover:text-[#02050A] transition-all duration-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
