import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarryBackground from "@/components/StarryBackground";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cityDatabase } from "@/data/houses";

interface ConsultationResult {
  id: string;
  name: string;
  year: string;
  mode: string;
  goal: number | null;
  houses_unlocked: number;
  result: Record<string, unknown> | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get("id");

  const [consultation, setConsultation] = useState<ConsultationResult | null>(null);
  const [consultations, setConsultations] = useState<ConsultationResult[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      // Fetch all consultations
      const { data: allConsultations } = await supabase
        .from("consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (allConsultations) {
        setConsultations(allConsultations as unknown as ConsultationResult[]);
        if (consultationId) {
          const found = allConsultations.find((c) => c.id === consultationId);
          if (found) setConsultation(found as unknown as ConsultationResult);
        } else if (allConsultations.length > 0) {
          setConsultation(allConsultations[0] as unknown as ConsultationResult);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user, consultationId]);

  const housesArray = Object.values(cityDatabase);
  const getHouseData = (houseNum: number) => cityDatabase[houseNum];
  const isHouseLocked = (houseNum: number) => {
    if (!consultation) return true;
    return houseNum > consultation.houses_unlocked;
  };

  const handleUnlockMore = () => navigate("/credits");

  if (loading) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-primary font-cinzel text-xl animate-pulse">Carregando mapa estelar...</div>
        </div>
      </>
    );
  }

  if (!consultation) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h2 className="font-cinzel text-2xl font-bold text-foreground mb-4">Nenhuma Consulta Encontrada</h2>
          <p className="text-muted-foreground text-sm mb-8">Calcule sua primeira rota estelar para ver o dashboard.</p>
          <button onClick={() => navigate("/")} className="px-8 py-3 rounded-xl bg-primary text-background font-bold text-sm uppercase tracking-widest">
            Calcular Rota
          </button>
        </div>
      </>
    );
  }

  const resultData = consultation.result as Record<string, unknown> | null;

  return (
    <>
      <StarryBackground />
      <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary transition-colors">
            ← Nova Consulta
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/credits")} className="text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-semibold">
              {profile?.credits ?? 0} Créditos
            </button>
          </div>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">Mapa Calculado</span>
          </div>
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase tracking-wider">
            Revolução Solar {consultation.year}
          </h1>
          <p className="text-muted-foreground text-sm font-light">{consultation.name}</p>
        </motion.div>

        {/* Consultation History (if multiple) */}
        {consultations.length > 1 && (
          <div className="flex gap-2 justify-center mb-8 overflow-x-auto pb-2">
            {consultations.map((c) => (
              <button
                key={c.id}
                onClick={() => setConsultation(c)}
                className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-medium transition-all whitespace-nowrap ${
                  c.id === consultation.id
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.year} · {c.name.split(" ")[0]}
              </button>
            ))}
          </div>
        )}

        {/* Houses Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-12">
          <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider text-center mb-6">
            As 12 Casas da Revolução Solar
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {housesArray.map((house) => {
              const locked = isHouseLocked(house.id);
              const isSelected = selectedHouse === house.id;

              return (
                <motion.button
                  key={house.id}
                  onClick={() => !locked && setSelectedHouse(isSelected ? null : house.id)}
                  whileHover={!locked ? { scale: 1.03 } : {}}
                  whileTap={!locked ? { scale: 0.97 } : {}}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-300 ${
                    locked
                      ? "border-muted/20 bg-card/30 opacity-50 cursor-not-allowed"
                      : isSelected
                        ? "border-primary/50 bg-primary/10 shadow-[0_0_30px_hsl(var(--gold)/0.1)]"
                        : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm z-10">
                      <svg className="w-6 h-6 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  )}
                  <div className="text-2xl mb-2">{house.emoji}</div>
                  <p className="text-primary font-cinzel text-xs font-bold uppercase tracking-wider">Casa {house.id}</p>
                  <p className="text-foreground text-sm font-medium mt-1">{house.label}</p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected House Detail */}
        <AnimatePresence>
          {selectedHouse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-panel glass-panel-glow p-8 md:p-12 mb-12"
            >
              {(() => {
                const h = getHouseData(selectedHouse);
                if (!h) return null;
                return (
                  <>
                    <div className="flex items-start gap-4 mb-6">
                      <span className="text-4xl">{h.emoji}</span>
                      <div>
                        <h3 className="font-cinzel text-xl font-bold text-foreground uppercase tracking-wider">
                          Casa {h.id} — {h.name}
                        </h3>
                        <p className="text-primary text-xs uppercase tracking-widest mt-1">{h.label}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">{h.resumo} — {h.porque}</p>

                    {/* Oracle section */}
                    <div className="bg-secondary/30 rounded-xl p-6 border border-primary/10">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3">Promessa da Casa {h.id}</p>
                      <p className="text-foreground/80 text-sm italic leading-relaxed font-light">
                        "{h.promessa_texto}"
                      </p>
                    </div>

                    {/* Result data if available */}
                    {resultData && resultData[`casa_${selectedHouse}`] && (
                      <div className="mt-6 bg-card/50 rounded-xl p-6 border border-border">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3">Resultado da Análise</p>
                        <p className="text-foreground/70 text-sm leading-relaxed whitespace-pre-wrap">
                          {String(resultData[`casa_${selectedHouse}`])}
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unlock More CTA */}
        {consultation.houses_unlocked < 12 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="glass-panel p-8 max-w-lg mx-auto">
              <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider mb-2">
                Desbloqueie Mais Casas
              </h3>
              <p className="text-muted-foreground text-xs font-light mb-6">
                {consultation.houses_unlocked === 1
                  ? "Você está vendo 1 casa. Use 1 crédito para ver 3 casas ou 2 créditos para o mapa completo."
                  : consultation.houses_unlocked === 3
                    ? "Você desbloqueou 3 casas. Use mais 1 crédito para ver todas as 12."
                    : `${consultation.houses_unlocked} casas desbloqueadas.`}
              </p>
              <button
                onClick={handleUnlockMore}
                className="px-8 py-3.5 rounded-xl bg-primary text-background font-bold text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all"
              >
                Comprar Créditos
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
