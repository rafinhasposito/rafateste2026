import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import StarryBackground from "@/components/StarryBackground";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cityDatabase } from "@/data/houses";

interface CityOption {
  city: string;
  country: string;
  continent: string;
  display_name: string;
  lat: number;
  lon: number;
}

interface HouseResult {
  city: CityOption;
  options: {
    nacional: CityOption | null;
    acessivel: CityOption | null;
    highticket: CityOption | null;
  };
}

interface ApiResult {
  results: Record<string, HouseResult>;
  oraculo?: string;
}

interface ConsultationRow {
  id?: string;
  name: string;
  year: string;
  mode: string;
  goal: number | null;
  houses_unlocked: number;
  result: ApiResult | null;
  created_at: string;
}

type DashboardLocationState = {
  tempConsultation?: ConsultationRow;
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get("id");

  const temp = (location.state as DashboardLocationState | null)?.tempConsultation;

  const [consultation, setConsultation] = useState<ConsultationRow | null>(temp ?? null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [loading, setLoading] = useState(!temp);

  useEffect(() => {
    if (temp) return;
    if (!user) return;

    const fetchData = async () => {
      const query = consultationId
        ? supabase
            .from("consultations")
            .select("*")
            .eq("id", consultationId)
            .eq("user_id", user.id)
        : supabase
            .from("consultations")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

      const { data } = await query;
      if (data && data.length > 0) {
        setConsultation(data[0] as unknown as ConsultationRow);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, consultationId, temp]);

  const goalHouse = consultation?.goal ?? null;

  const isHouseLocked = (houseNum: number) => {
    if (!consultation) return true;
    return houseNum > consultation.houses_unlocked;
  };

  const getHouseResult = (houseNum: number): HouseResult | null => {
    if (!consultation?.result?.results) return null;
    return consultation.result.results[String(houseNum)] || null;
  };

  const houses = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

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
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest"
          >
            Calcular Rota
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <StarryBackground />
      {user && <UserMenu />}

      <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary transition-colors"
          >
            ← Nova Consulta
          </button>
          <button
            onClick={() => navigate("/credits")}
            className="text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            {profile?.credits ?? 0} Créditos
          </button>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">Mapa Calculado</span>
          </div>
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase tracking-wider">
            Revolução Solar {consultation.year}
          </h1>
          <p className="text-muted-foreground text-sm font-light">{consultation.name}</p>
          {goalHouse && (
            <p className="text-primary/70 text-xs mt-2 uppercase tracking-widest">
              Casa-alvo: {goalHouse} — {cityDatabase[goalHouse]?.label}
            </p>
          )}
        </motion.div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {houses.map((houseNum) => {
            const house = cityDatabase[houseNum];
            const result = getHouseResult(houseNum);
            const locked = isHouseLocked(houseNum);
            const isGoal = goalHouse === houseNum;
            const isSelected = selectedHouse === houseNum;

            return (
              <motion.button
                key={houseNum}
                onClick={() => !locked && setSelectedHouse(isSelected ? null : houseNum)}
                whileHover={!locked ? { scale: 1.02 } : {}}
                whileTap={!locked ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: houseNum * 0.03 }}
                className={`relative p-5 rounded-2xl border text-left transition-all duration-300 ${
                  locked
                    ? "border-muted/20 bg-card/20 opacity-40 cursor-not-allowed"
                    : isSelected
                      ? "border-primary/50 bg-primary/10 shadow-[0_0_30px_hsl(var(--gold)/0.15)]"
                      : isGoal
                        ? "border-primary/30 bg-primary/5 hover:border-primary/50"
                        : "border-border bg-card/50 hover:border-primary/30"
                }`}
              >
                {locked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm z-10">
                    <svg
                      className="w-6 h-6 text-muted-foreground/40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                )}

                <div className="absolute top-3 right-3 w-9 h-9 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center">
                  <span className="font-cinzel text-sm font-bold text-primary">{houseNum}</span>
                </div>

                {isGoal && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Alvo</span>
                  </div>
                )}

                <div className="flex items-start gap-3 pr-10">
                  <span className="text-2xl">{house?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-primary font-cinzel text-xs font-bold uppercase tracking-wider">Casa {houseNum}</p>
                    <p className="text-foreground text-sm font-medium mt-0.5">{house?.label}</p>
                    <p className="text-muted-foreground text-xs mt-2 line-clamp-2">Vantagem: {house?.beneficio}</p>

                    {result && !locked && (
                      <div className="mt-3 flex items-center gap-2">
                        <svg
                          className="w-3.5 h-3.5 text-primary/70 shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="text-foreground/80 text-xs font-medium truncate">{result.city.display_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Selected House Detail */}
        <AnimatePresence>
          {selectedHouse && (() => {
            const house = cityDatabase[selectedHouse];
            const result = getHouseResult(selectedHouse);
            if (!house) return null;

            return (
              <motion.div
                key={selectedHouse}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel glass-panel-glow p-6 md:p-10 mb-10"
              >
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-4xl">{house.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-cinzel text-xl font-bold text-foreground uppercase tracking-wider">
                        Casa {house.id} — {house.name}
                      </h3>
                      <span className="px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-widest font-semibold">
                        {house.label}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">{house.resumo} — {house.porque}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-card/50 border border-border rounded-xl p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold mb-2">Vantagem</p>
                    <p className="text-foreground text-sm leading-relaxed">{house.beneficio}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-2">Ideal para: {house.ideal}</p>
                  </div>

                  {result && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold mb-2">📍 Lugares Reais (Destino)</p>
                      <p className="text-foreground font-bold text-lg">{result.city.display_name}</p>
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {result.options.nacional && (
                          <div className="flex items-center justify-between gap-3 bg-card/50 border border-border rounded-lg px-3 py-2">
                            <span className="text-xs font-semibold text-foreground">Opção Nacional</span>
                            <span className="text-xs text-muted-foreground truncate">{result.options.nacional.display_name}</span>
                          </div>
                        )}
                        {result.options.acessivel && (
                          <div className="flex items-center justify-between gap-3 bg-card/50 border border-border rounded-lg px-3 py-2">
                            <span className="text-xs font-semibold text-foreground">Mais Acessível</span>
                            <span className="text-xs text-muted-foreground truncate">{result.options.acessivel.display_name}</span>
                          </div>
                        )}
                        {result.options.highticket && (
                          <div className="flex items-center justify-between gap-3 bg-card/50 border border-border rounded-lg px-3 py-2">
                            <span className="text-xs font-semibold text-foreground">High Ticket</span>
                            <span className="text-xs text-muted-foreground truncate">{result.options.highticket.display_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-secondary/30 rounded-xl p-6 border border-primary/10 mb-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold mb-3">{house.promessa_titulo}</p>
                  <p className="text-foreground/80 text-sm italic leading-relaxed font-light">"{house.promessa_texto}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card/40 rounded-xl p-4 border border-border">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">💼 Profissional</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{house.prof}</p>
                  </div>
                  <div className="bg-card/40 rounded-xl p-4 border border-border">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">❤️ Amor</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{house.amor}</p>
                  </div>
                  <div className="bg-card/40 rounded-xl p-4 border border-border">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-primary font-semibold mb-2">🧘 Pessoal</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{house.pessoal}</p>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Unlock More CTA */}
        {consultation.houses_unlocked < 12 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
            <div className="glass-panel p-8 max-w-lg mx-auto">
              <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider mb-2">Desbloqueie Mais Casas</h3>
              <p className="text-muted-foreground text-xs font-light mb-6">
                Você está vendo {consultation.houses_unlocked} de 12 casas. Compre créditos para desbloquear o mapa completo.
              </p>
              <button
                onClick={() => navigate("/credits")}
                className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all"
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
