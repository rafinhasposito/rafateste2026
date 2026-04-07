import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Eye, Unlock, CreditCard } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cityDatabase, houseColors } from "@/data/houses";

interface ConsultationRow {
  id: string;
  name: string;
  year: string;
  mode: string;
  goal: number | null;
  origin: string | null;
  birth_place: string;
  houses_unlocked: number;
  created_at: string;
}

function extractAccentRGB(house: number): string {
  const gradient = houseColors[house] || "";
  const match = gradient.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) return `${match[1]}, ${match[2]}, ${match[3]}`;
  return "255, 215, 0";
}

const History = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("consultations")
        .select("id, name, year, mode, goal, origin, birth_place, houses_unlocked, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setConsultations(data as ConsultationRow[]);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <StarryBackground />
      {user && <UserMenu />}
      <div className="min-h-screen px-4 py-16 max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <button onClick={() => navigate("/")} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary transition-colors mb-8 inline-block">
            ← Voltar
          </button>
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-foreground mb-3 uppercase tracking-wider">
            Meu Perfil Estelar
          </h1>
          <p className="text-muted-foreground text-sm font-light max-w-lg mx-auto">
            Histórico completo das suas consultas de Revolução Solar
          </p>

          {/* Stats */}
          {profile && (
            <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-primary font-cinzel text-lg font-bold">{profile.credits}</span>
                <span className="text-muted-foreground text-[10px] uppercase tracking-widest">créditos</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-card/50">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-cinzel text-lg font-bold">{consultations.length}</span>
                <span className="text-muted-foreground text-[10px] uppercase tracking-widest">consultas</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="text-center">
            <p className="text-primary font-cinzel text-lg animate-pulse">Carregando histórico...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && consultations.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm mb-6">Nenhuma consulta realizada ainda.</p>
            <button onClick={() => navigate("/")} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest">
              Calcular Primeira Rota
            </button>
          </div>
        )}

        {/* Consultation Cards */}
        {!loading && consultations.length > 0 && (
          <div className="space-y-4">
            {consultations.map((c, i) => {
              const isPast = c.mode === "passado";
              const goalHouse = c.goal;
              const houseData = goalHouse ? cityDatabase[goalHouse] : null;
              const accent = goalHouse ? extractAccentRGB(goalHouse) : "255, 215, 0";

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-card/40 backdrop-blur-sm p-5 md:p-6 hover:shadow-lg transition-all"
                  style={{
                    border: `1px solid rgba(${accent}, 0.2)`,
                    borderLeft: `4px solid rgba(${accent}, 0.6)`,
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Left info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border ${
                          isPast
                            ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                            : "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                        }`}>
                          {isPast ? "Passado" : "Futuro"}
                        </span>
                        <span className="text-foreground font-cinzel font-bold text-sm">
                          Revolução Solar {c.year}
                        </span>
                      </div>

                      <p className="text-foreground/80 text-sm mb-1">{c.name}</p>

                      {goalHouse && houseData && (
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: `rgb(${accent})` }}
                          />
                          <p
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: `rgb(${accent})` }}
                          >
                            Casa {goalHouse} — {houseData.label}
                          </p>
                        </div>
                      )}

                      {c.origin && (
                        <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[11px]">{c.origin}</span>
                        </div>
                      )}
                    </div>

                    {/* Right meta */}
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                      <div className="flex items-center gap-4 text-muted-foreground text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          {formatDate(c.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {formatTime(c.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                        <Unlock className="w-3 h-3" />
                        <span>{c.houses_unlocked} de 12 casas desbloqueadas</span>
                      </div>

                      <button
                        onClick={() => navigate(`/dashboard?id=${c.id}`)}
                        className="mt-1 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                        style={{
                          background: `rgba(${accent}, 0.1)`,
                          border: `1px solid rgba(${accent}, 0.2)`,
                          color: `rgb(${accent})`,
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Oráculo
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
