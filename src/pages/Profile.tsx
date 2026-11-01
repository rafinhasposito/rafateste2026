import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackButton } from '@/components/ui/BackButton';
import { motion } from "framer-motion";
import { User, Calendar, Clock, MapPin, Save, CreditCard, History as HistoryIcon, ArrowLeft, Compass, Sparkles } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import PageLoader from "@/components/PageLoader";

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
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
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
    toast.success("Perfil salvo com sucesso.");
    await refreshProfile();
    if (returnTo) {
      navigate(returnTo);
    }
  };

  if (loading || !user) {
    return <PageLoader label="Carregando perfil..." />;
  }

  return (
    <div className="min-h-[100dvh] px-4 sm:px-6 pt-20 lg:pt-10 pb-28 lg:pb-16 max-w-5xl mx-auto relative z-10">
      <div className={`justify-between items-center mb-6 ${returnTo ? "flex" : "hidden lg:flex"}`}>
        <BackButton label={returnTo ? "Voltar para a Consulta" : "Descobrir"} to={returnTo || "/"} />
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-semibold text-[#F5DE98]/80 mb-2">
          Minha Conta
        </span>
        <h1 className="font-ps-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
          Seu Perfil & Dados de Nascimento
        </h1>
        <p className="font-ps-ui text-white/60 text-sm md:text-base max-w-2xl">
          Salve seus dados natais uma única vez para calcular qualquer cidade ou aniversário em segundos.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Lado Esquerdo: Identidade, Créditos e Atalhos */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-[#08111F]/90 border border-[#C9A227]/20 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.45)] space-y-6"
          >
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C9A227]/40" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#0E1B30] border border-[#C9A227]/35 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#F5DE98]" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white font-ps-display text-lg font-bold truncate">{fullName || profile?.display_name || "Membro"}</p>
                <p className="text-white/50 font-ps-ui text-xs truncate">{profile?.email}</p>
              </div>
            </div>

            <div className="pt-5 border-t border-white/[0.08]">
              <span className="text-[10px] font-ps-ui font-semibold uppercase tracking-[0.2em] text-white/50 block mb-2">
                Saldo Disponível
              </span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-ps-display text-5xl text-[#F5DE98] font-bold leading-none">{profile?.credits ?? 0}</span>
                <span className="font-ps-ui text-xs text-[#F5DE98]/70 uppercase tracking-widest">
                  crédito{profile?.credits === 1 ? "" : "s"}
                </span>
              </div>
              <button
                onClick={() => navigate("/credits")}
                className="w-full py-3.5 bg-[#C9A227]/15 text-[#F5DE98] border border-[#C9A227]/40 hover:bg-[#C9A227]/25 transition-all font-ps-ui text-[11px] uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 rounded-xl"
              >
                <CreditCard className="w-4 h-4 text-[#E5C158]" /> Comprar Créditos
              </button>
            </div>

            {/* Guias Rápidos & Como Funciona */}
            <div className="pt-5 border-t border-white/[0.08] space-y-2.5">
              <span className="text-[10px] font-ps-ui font-semibold uppercase tracking-[0.2em] text-white/45 block mb-2">
                Ajuda & Entendimento
              </span>
              <button
                onClick={() => navigate("/app/onboarding")}
                className="w-full py-3 px-3.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-xl text-white/85 hover:text-white transition-all text-xs font-ps-ui flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-[#C9A227]" />
                  <span>Ver Guia Rápido (6 passos)</span>
                </div>
                <span className="text-white/40 text-xs">→</span>
              </button>

              <button
                onClick={() => navigate("/tecnologia")}
                className="w-full py-3 px-3.5 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 border border-[#C9A227]/30 rounded-xl text-[#F5DE98] transition-all text-xs font-ps-ui flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#E5C158]" />
                  <span>Como Funciona a Revolução Solar</span>
                </div>
                <span className="text-[#C9A227] text-xs">→</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <button
                onClick={signOut}
                className="w-full py-2.5 px-3 rounded-xl text-red-300/80 hover:text-red-200 hover:bg-red-500/10 border border-transparent hover:border-red-400/20 transition-all text-[11px] font-ps-ui uppercase tracking-[0.18em] font-semibold text-center"
              >
                Sair da Conta
              </button>
            </div>
          </motion.div>
        </div>

        {/* Lado Direito: Formulário Natal e Histórico Recente */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#08111F]/90 border border-[#C9A227]/25 backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
          >
            <div className="mb-6">
              <h2 className="font-ps-display text-2xl text-white font-bold mb-1.5">Dados de Nascimento</h2>
              <p className="text-white/55 font-ps-ui text-xs sm:text-sm leading-relaxed">
                A hora e a cidade exatas em que você nasceu são essenciais para calcular o seu Ascendente anual em cada cidade do mundo.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-ps-ui font-semibold uppercase tracking-[0.16em] text-[#F5DE98] mb-2 block">
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full rounded-xl border border-white/15 bg-[#040914]/90 px-4 py-3.5 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-ps-ui font-semibold uppercase tracking-[0.16em] text-[#F5DE98] mb-2 block">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#040914]/90 px-4 py-3.5 text-base text-white focus:outline-none focus:border-[#C9A227] transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-ps-ui font-semibold uppercase tracking-[0.16em] text-[#F5DE98] mb-2 block">
                    Hora Exata (Certidão)
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={e => setBirthTime(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#040914]/90 px-4 py-3.5 text-base text-white focus:outline-none focus:border-[#C9A227] transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-ps-ui font-semibold uppercase tracking-[0.16em] text-[#F5DE98] mb-2 block">
                  Cidade Onde Você Nasceu
                </label>
                <CityAutocomplete
                  value={birthCity}
                  onChange={(v, valid, coords) => {
                    setBirthCity(v);
                    setBirthCityValid(valid);
                    if (coords) setBirthCoords(coords);
                  }}
                  placeholder="Digite sua cidade natal e selecione na lista"
                  className="w-full rounded-xl border border-white/15 bg-[#040914]/90 px-4 py-3.5 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C9A227] text-[#02050A] hover:bg-[#E5C158] disabled:opacity-40 transition-all font-ps-ui text-xs uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2.5 shadow-[0_10px_28px_rgba(201,162,39,0.28)]"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Salvando..." : returnTo ? "Salvar e Continuar Consulta" : "Salvar Dados de Nascimento"}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#08111F]/90 border border-white/[0.08] backdrop-blur-xl shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-ps-display text-xl text-white font-bold">Consultas Recentes</h2>
              <button onClick={() => navigate("/history")} className="text-[#F5DE98] text-[11px] uppercase tracking-[0.16em] font-semibold hover:text-white transition-colors">
                Ver Todas →
              </button>
            </div>
            
            {recent.length === 0 ? (
              <p className="text-white/45 text-sm font-ps-ui">Você ainda não realizou nenhuma consulta.</p>
            ) : (
              <div className="space-y-3">
                {recent.map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/dashboard?id=${c.id}`)}
                    className="w-full text-left flex items-center justify-between p-4 border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#C9A227]/30 transition-all rounded-2xl group"
                  >
                    <div>
                      <p className="text-white font-ps-display text-base font-semibold group-hover:text-[#F5DE98] transition-colors">
                        {c.name} · {c.year}
                      </p>
                      <p className="text-white/45 font-ps-ui text-[10px] uppercase tracking-[0.16em] mt-1">
                        {c.mode}{c.origin ? ` · ${c.origin}` : ""}
                      </p>
                    </div>
                    <p className="text-white/40 font-ps-ui text-xs">{new Date(c.created_at).toLocaleDateString("pt-BR")}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
