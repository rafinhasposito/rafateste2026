import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Eye, Unlock, CreditCard, Compass, Crown, Scroll, ArrowDownLeft, ArrowUpRight, ArrowLeft, Map } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";

import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cityDatabase, houseColors } from "@/data/houses";

interface ConsultationRow {
  id: string;
  name: string;
  year: string;
  mode: string;
  goal: number | null;
  intent: string | null;
  origin: string | null;
  birth_place: string;
  houses_unlocked: number;
  created_at: string;
}

interface TransactionRow {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

function extractAccentColor(house: number): string {
  const gradient = houseColors[house] || "";
  const match = gradient.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) return `${match[1]}, ${match[2]}, ${match[3]}`;
  return "255, 215, 0";
}

function inferSearchType(c: ConsultationRow): { label: string; icon: typeof Compass } {
  if (c.origin) return { label: "Por Cidade", icon: Compass };
  if (c.intent) return { label: "Por Intenção", icon: Scroll };
  return { label: "Por Casa", icon: Crown };
}

const History = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationRow[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("History useEffect. user:", user?.id);
    if (!user) return;
    const load = async () => {
      console.log("load() called");
      const [consultsRes, txRes] = await Promise.all([
        supabase
          .from("consultations")
          .select("id, name, year, mode, goal, intent, origin, birth_place, houses_unlocked, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("credit_transactions")
          .select("id, amount, type, description, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);
      console.log("Supabase response:", consultsRes.error, txRes.error);
      if (consultsRes.data) setConsultations(consultsRes.data as ConsultationRow[]);
      if (txRes.data) setTransactions(txRes.data as TransactionRow[]);
      setLoading(false);
      console.log("Loading set to false, length:", consultsRes.data?.length);
    };
    load();
  }, [user]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <StarryBackground />
      <div className="min-h-[100dvh] px-4 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="mb-12">
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 text-[10px] font-sans uppercase tracking-[0.2em] hover:text-[#D4AF37] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Descobrir
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-2 leading-tight"
          >
            Arquivo de Consultas
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-6 mt-4 text-[#D4AF37] font-sans text-[10px] uppercase tracking-widest font-bold">
            <span className="flex items-center gap-2"><Map className="w-3 h-3" /> {consultations.length} Consultas Salvas</span>
          </motion.div>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/60 font-sans text-xs uppercase tracking-widest" role="status" aria-live="polite">
              Acessando arquivos...
            </p>
          </div>
        )}

        {!loading && consultations.length === 0 && (
          <div className="text-center py-24 border border-white/10 bg-white/[0.02]">
            <MapPin className="w-8 h-8 text-white/20 mx-auto mb-4" />
            <h2 className="font-cinzel text-xl text-white mb-2">Nenhum dossiê gerado</h2>
            <p className="text-white/50 text-xs font-inter mb-6">Calcule sua primeira rota estelar para começar sua jornada.</p>
            <button onClick={() => navigate("/")} className="px-8 py-4 bg-white text-black hover:bg-gray-200 transition-all font-sans text-xs uppercase tracking-widest font-bold">
              Nova Consulta
            </button>
          </div>
        )}

        {!loading && consultations.length > 0 && (
          <div className="space-y-4 mb-20">
            {consultations.map((c, i) => {
              const isPast = c.mode === "passado";
              const goalHouse = c.goal;
              const houseData = goalHouse ? cityDatabase[goalHouse] : null;
              const searchType = inferSearchType(c);
              const SearchIcon = searchType.icon;

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-lg group"
                >
                  <div className="flex-1 min-w-0 mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[9px] font-sans font-bold uppercase tracking-[0.2em] px-2 py-1 border ${
                        isPast ? "text-white/60 border-white/20" : "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/5"
                      }`}>
                        {isPast ? "Passado" : "Futuro"}
                      </span>
                      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-white/50 flex items-center gap-1.5">
                        <SearchIcon className="w-3 h-3" />
                        {searchType.label}
                      </span>
                    </div>

                    <h3 className="text-white font-cinzel text-xl group-hover:text-[#D4AF37] transition-colors mb-1">
                      {c.name}
                    </h3>

                    {goalHouse && houseData && (
                      <p className="text-white/60 text-xs font-inter mb-2">
                        Foco na <strong className="text-white">Casa {goalHouse}</strong> — {houseData.label}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-white/40 text-[10px] font-sans uppercase tracking-widest mt-2">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDate(c.created_at)}</span>
                      {c.origin && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {c.origin}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 shrink-0">
                    <span className="text-[#D4AF37]/60 text-[10px] font-sans uppercase tracking-widest flex items-center gap-1.5">
                      <Unlock className="w-3 h-3" /> {c.houses_unlocked} Casas Reveladas
                    </span>
                    <button data-id={c.id}
                      onClick={() => navigate(`/dashboard?id=${c.id}`)}
                      className="w-full md:w-auto px-6 py-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all font-sans text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5" /> Abrir Dossiê
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-8 border-t border-white/10">
            <h2 className="font-cinzel text-xl text-white mb-6">Extrato de Créditos</h2>
            <div className="space-y-3">
              {transactions.map((tx) => {
                const isPositive = tx.amount > 0;
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isPositive ? "bg-white/10 border border-white/20" : "bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                      }`}>
                        {isPositive ? <ArrowDownLeft className="w-4 h-4 text-white" /> : <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-sans uppercase tracking-widest font-bold">{tx.description || tx.type}</p>
                        <p className="text-white/40 font-inter text-[10px]">{formatDate(tx.created_at)} às {formatTime(tx.created_at)}</p>
                      </div>
                    </div>
                    <span className={`font-cinzel text-xl ${isPositive ? "text-white" : "text-[#D4AF37]"}`}>
                      {isPositive ? "+" : ""}{tx.amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default History;
