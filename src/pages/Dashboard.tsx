import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarryBackground from "@/components/StarryBackground";
import UserMenu from "@/components/UserMenu";
import HouseCard from "@/components/HouseCard";
import HouseDetail from "@/components/HouseDetail";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cityDatabase, houseColors, fallbackOraclesFuture, fallbackOraclesPast } from "@/data/houses";

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
  id: string;
  name: string;
  year: string;
  mode: string;
  goal: number | null;
  houses_unlocked: number;
  result: ApiResult | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get("id");

  const [consultation, setConsultation] = useState<ConsultationRow | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [initialHouseSet, setInitialHouseSet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      let query = supabase
        .from("consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (consultationId) {
        query = supabase
          .from("consultations")
          .select("*")
          .eq("id", consultationId)
          .eq("user_id", user.id);
      }

      const { data } = await query;
      if (data && data.length > 0) {
        setConsultation(data[0] as unknown as ConsultationRow);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, consultationId]);

  useEffect(() => {
    if (consultation && !initialHouseSet) {
      if (consultation.goal) {
        setSelectedHouse(consultation.goal);
      }
      setInitialHouseSet(true);
    }
  }, [consultation, initialHouseSet]);

  const isHouseLocked = (houseNum: number) => {
    if (!consultation) return true;
    return houseNum > consultation.houses_unlocked;
  };

  const getHouseResult = (houseNum: number): HouseResult | null => {
    if (!consultation?.result?.results) return null;
    return consultation.result.results[String(houseNum)] || null;
  };

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
          <button onClick={() => navigate("/")} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest">
            Calcular Rota
          </button>
        </div>
      </>
    );
  }

  const goalHouse = consultation.goal;
  const oracleText = consultation.result?.oraculo
    || (goalHouse
      ? (consultation.mode === "passado" ? fallbackOraclesPast[goalHouse] : fallbackOraclesFuture[goalHouse])
      : null);

  return (
    <>
      <StarryBackground />
      {user && <UserMenu />}
      <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto relative z-10">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate("/")} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary transition-colors">
            ← Nova Consulta
          </button>
          <button onClick={() => navigate("/credits")} className="text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors font-semibold">
            {profile?.credits ?? 0} Créditos
          </button>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
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

        {/* Oracle Text */}
        {oracleText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12 rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-6 md:p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-semibold mb-3 text-center">
              🔮 Oráculo do Mestre Astrólogo
            </p>
            <p className="text-foreground/80 text-sm italic leading-relaxed text-center font-light">
              "{oracleText}"
            </p>
          </motion.div>
        )}

        {/* Selected House Detail (shows above grid) */}
        <AnimatePresence>
          {selectedHouse && (() => {
            const house = cityDatabase[selectedHouse];
            const result = getHouseResult(selectedHouse);
            if (!house) return null;
            return (
              <HouseDetail
                house={house}
                result={result}
                onClose={() => setSelectedHouse(null)}
              />
            );
          })()}
        </AnimatePresence>

        {/* Houses Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((houseNum) => {
            const house = cityDatabase[houseNum];
            const result = getHouseResult(houseNum);
            const locked = isHouseLocked(houseNum);
            const isGoal = goalHouse === houseNum;
            const isSelected = selectedHouse === houseNum;

            return (
              <HouseCard
                key={houseNum}
                houseNum={houseNum}
                house={house}
                result={result}
                locked={locked}
                isGoal={isGoal}
                isSelected={isSelected}
                onSelect={() => setSelectedHouse(isSelected ? null : houseNum)}
              />
            );
          })}
        </div>

        {/* Unlock More CTA */}
        {consultation.houses_unlocked < 12 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 backdrop-blur-sm p-8 max-w-lg mx-auto">
              <h3 className="font-cinzel text-lg font-bold text-foreground uppercase tracking-wider mb-2">
                Desbloqueie Mais Casas
              </h3>
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
