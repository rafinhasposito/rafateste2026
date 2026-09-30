import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, ArrowUpRight, CheckCircle2, Loader2, Fingerprint, MapPin, Search, Compass, Scroll, Crown } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
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

  const getModeStyles = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "passado":
        return "text-white/60 border-white/20 bg-white/5";
      case "presente":
        return "text-blue-400 border-blue-400/30 bg-blue-400/10";
      case "futuro":
      default:
        return "text-[#C9A227] border-[#C9A227]/30 bg-[#C9A227]/5";
    }
  };

  return (
    <div className="min-h-screen bg-ps-void text-ps-text font-ps-ui selection:bg-ps-gold/30">
      <StarryBackground />
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
<BackButton className="mb-8" label="Descobrir" to="/"/>

        <div className="mb-12">
          <h1 className="font-ps-display text-4xl md:text-5xl text-ps-champagne mb-4">Arquivo Confidencial</h1>
          <p className="text-ps-muted text-sm md:text-base max-w-2xl leading-relaxed">
            Acesse o histórico completo das suas missões decodificadas. Todo o seu rastro estratégico e 
            rotas traçadas estão arquivados de forma segura no Protocolo Solar.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 text-ps-gold animate-spin" />
            <p className="text-ps-gold text-xs uppercase tracking-widest font-bold animate-pulse">Sincronizando Banco de Dados</p>
          </div>
        ) : consultations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center py-32 bg-ps-surface border border-white/5 rounded-3xl">
            <Fingerprint className="w-16 h-16 text-ps-muted mb-6" />
            <h2 className="font-ps-display text-3xl text-ps-champagne mb-4">Nenhum dossiê decodificado.</h2>
            <p className="text-ps-muted text-sm mb-8 max-w-md">Sua jornada ainda não começou. Calcule o seu primeiro mapa para gerar um dossiê definitivo.</p>
            <button onClick={() => navigate("/")} className="px-8 py-4 bg-ps-gold text-ps-void hover:bg-ps-gold-deep transition-colors rounded-xl text-xs uppercase tracking-widest font-bold">
              Iniciar Missão
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {consultations.map((c, i) => {
              const modeLabel = c.mode?.toLowerCase() || "futuro";
              const hasIntent = !!c.intent;
              const hasHouse = c.goal !== null && c.goal !== undefined;
              const hasOrigin = !!c.origin;
              const shortId = c.id.substring(0, 8);
              
              // A Lógica da Badge de Topo (Método de Busca)
              let MethodIcon = Crown;
              let methodLabel = "BUSCA: POR CASA";
              if (hasOrigin) {
                MethodIcon = Compass;
                methodLabel = "BUSCA: POR CIDADE";
              }
              
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group bg-ps-surface border border-white/5 hover:border-ps-gold/30 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-ps-gold/5 blur-3xl rounded-full pointer-events-none group-hover:bg-ps-gold/10 transition-colors duration-700"></div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getModeStyles(modeLabel)}`}>
                          Tempo: {modeLabel.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 border border-white/10 text-white/40 text-[9px] uppercase tracking-widest rounded-full flex items-center gap-1.5 font-bold">
                          <MethodIcon className="w-3 h-3" />
                          {methodLabel}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-ps-muted text-[10px] uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" />
                        {c.houses_unlocked} {c.houses_unlocked === 1 ? 'Casa' : 'Casas'}
                      </div>
                    </div>
                    
                    <div className="mb-2 text-white/30 font-mono text-[10px] uppercase tracking-widest">
                      ID: {shortId} • DOSSIÊ ASTROLÓGICO
                    </div>

                    <h3 className="font-ps-display text-2xl md:text-3xl text-ps-champagne mb-4 group-hover:text-white transition-colors duration-300 line-clamp-1">
                      {c.name || "Dossiê Desconhecido"}
                    </h3>

                    {/* Renderização de Foco e Origem */}
                    <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      {(() => {
                         const displayIntent = c.intent ? (intentMap[c.intent.toLowerCase()] || c.intent) : "Análise Geral";
                         
                         if (hasOrigin) {
                           return (
                             <p className="font-ps-ui text-sm text-white/90">
                               <span className="text-[#C9A227] font-bold">📍 Origem:</span> {c.origin} • Destino: Casa {c.goal} <span className="text-white/40 ml-1">(Foco: {displayIntent})</span>
                             </p>
                           );
                         } else {
                           return (
                             <p className="font-ps-ui text-sm text-white/90">
                               <span className="text-[#C9A227] font-bold">🎯 Foco:</span> {displayIntent} • Casa {c.goal}
                             </p>
                           );
                         }
                      })()}
                    </div>

                    <div className="space-y-3 mb-8">
                      <p className="flex items-center gap-3 text-ps-muted text-[11px] uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-white/10" /> 
                        Data da Consulta: <span className="text-white/60">{formatDate(c.created_at)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-ps-muted text-[9px] uppercase tracking-[0.2em] block mb-1">Status</span>
                      <span className="text-ps-gold text-sm font-ps-ui flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-ps-gold rounded-full animate-pulse"></div> Ativo e Sincronizado</span>
                    </div>

                    <button 
                      onClick={() => navigate(`/dashboard?id=${c.id}`)}
                      className="shrink-0 px-6 h-12 rounded-full bg-white/5 border border-white/10 text-ps-champagne flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-ps-gold hover:border-ps-gold hover:text-ps-void transition-all duration-300 group-hover:scale-105"
                    >
                      Acessar <ArrowUpRight className="w-4 h-4" />
                    </button>
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
