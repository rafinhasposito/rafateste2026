import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Calendar, Clock, MapPin, Save, CreditCard, History as HistoryIcon, ArrowLeft } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import UserMenu from "@/components/UserMenu";
import CityAutocomplete from "@/components/CityAutocomplete";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConsultRow {
  id: string;
  name: string;
  year: string;
  mode: string;
  origin: string | null;
  created_at: string;
}

const Profile = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [birthCityValid, setBirthCityValid] = useState(false);
  const [birthCoords, setBirthCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [recent, setRecent] = useState<ConsultRow[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, birth_date, birth_time, birth_city, birth_lat, birth_lon")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setFullName(data.full_name || profile?.display_name || "");
        setBirthDate(data.birth_date || "");
        setBirthTime(data.birth_time ? String(data.birth_time).slice(0, 5) : "");
        setBirthCity(data.birth_city || "");
        if (data.birth_city) setBirthCityValid(true);
        if (data.birth_lat && data.birth_lon) setBirthCoords({ lat: Number(data.birth_lat), lon: Number(data.birth_lon) });
      }
      const { data: cons } = await supabase
        .from("consultations")
        .select("id, name, year, mode, origin, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (cons) setRecent(cons as ConsultRow[]);
    })();
  }, [user, profile?.display_name]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const parts = birthCity.split(",").map(s => s.trim());
    const country = parts.length > 1 ? parts[parts.length - 1] : null;
    const { error } = await supabase.from("profiles").update({
      full_name: fullName.trim() || null,
      birth_date: birthDate || null,
      birth_time: birthTime || null,
      birth_city: birthCity.trim() || null,
      birth_country: country,
      birth_lat: birthCoords?.lat ?? null,
      birth_lon: birthCoords?.lon ?? null,
      display_name: fullName.trim() || profile?.display_name || null,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Perfil salvo. Suas próximas consultas virão pré-preenchidas.");
    refreshProfile();
  };

  if (loading || !user) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-screen flex items-center justify-center text-primary font-cinzel animate-pulse">Carregando...</div>
      </>
    );
  }

  return (
    <>
      <StarryBackground />
      <UserMenu />
      <div className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest hover:text-primary mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="font-cinzel text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wider mb-2"
        >
          Meu Perfil
        </motion.h1>
        <p className="text-muted-foreground text-sm mb-8">Salve seus dados natais uma vez. O sistema lembra para sempre.</p>

        {/* Minha Conta */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 mb-6 border-l-4" style={{ borderColor: "hsl(var(--gold) / 0.5)" }}>
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full border-2 border-primary/30 object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-primary/30 bg-primary/10 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium truncate">{fullName || profile?.display_name || profile?.email}</p>
              <p className="text-muted-foreground text-xs truncate">{profile?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Créditos</p>
              <p className="font-cinzel text-3xl text-primary font-bold leading-none">{profile?.credits ?? 0}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/credits")}
            className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.14em] hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)] transition-all"
          >
            <CreditCard className="w-4 h-4" /> Comprar mais créditos
          </button>
        </motion.div>

        {/* Dados Natais */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass-panel p-6 mb-6">
          <h2 className="font-cinzel text-base uppercase tracking-wider text-foreground mb-1">Meus Dados Natais</h2>
          <p className="text-muted-foreground text-xs mb-5">Opcional. Quando preenchido, as consultas vêm pré-preenchidas.</p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5"><User className="w-3 h-3" />Nome Completo</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Seu nome e sobrenome" className="quantum-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5"><Calendar className="w-3 h-3" />Data</label>
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="quantum-input" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5"><Clock className="w-3 h-3" />Hora</label>
                <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} className="quantum-input" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5"><MapPin className="w-3 h-3" />Cidade de Nascimento</label>
              <CityAutocomplete
                value={birthCity}
                onChange={(v, valid, coords) => {
                  setBirthCity(v);
                  setBirthCityValid(valid);
                  if (coords) setBirthCoords(coords);
                }}
                placeholder="Digite e selecione da lista"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-primary/40 bg-primary/10 text-primary font-bold text-xs uppercase tracking-[0.14em] hover:bg-primary/20 transition-all disabled:opacity-40"
            >
              <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar Perfil"}
            </button>
          </div>
        </motion.div>

        {/* Últimas Consultas */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cinzel text-base uppercase tracking-wider text-foreground flex items-center gap-2"><HistoryIcon className="w-4 h-4 text-primary" />Últimas Consultas</h2>
            <button onClick={() => navigate("/history")} className="text-primary text-[10px] uppercase tracking-widest hover:underline">Ver todas →</button>
          </div>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">Você ainda não realizou nenhuma consulta.</p>
          ) : (
            <div className="space-y-2">
              {recent.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{c.name} · {c.year}</p>
                    <p className="text-muted-foreground text-xs truncate">{c.mode}{c.origin ? ` · ${c.origin}` : ""}</p>
                  </div>
                  <p className="text-muted-foreground/60 text-[10px]">{new Date(c.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Profile;
