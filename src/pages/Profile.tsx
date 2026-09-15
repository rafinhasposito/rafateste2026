import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Calendar, Clock, MapPin, Save, CreditCard, History as HistoryIcon, ArrowLeft } from "lucide-react";
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
    <>
      <StarryBackground />

      <div className="min-h-[100dvh] px-4 py-16 md:py-24 max-w-4xl mx-auto relative">
        <div className="flex justify-between items-center mb-8">
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => {
              if (returnTo) navigate(returnTo);
              else navigate("/");
            }}
            className="flex items-center gap-2 text-white/50 text-[10px] font-sans uppercase tracking-[0.2em] hover:text-[#C9A227] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {returnTo ? "Voltar" : "Início"}
          </motion.button>

          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={signOut}
            className="flex items-center gap-2 text-red-400/80 text-[10px] font-sans uppercase tracking-[0.2em] hover:text-red-400 transition-colors border border-red-400/20 px-3 py-1.5 rounded-full"
          >
            Sair
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-ps-display text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
            Seu Arquivo Cósmico
          </h1>
          <p className="font-ps-ui text-white/50 text-sm">Gerencie sua identidade astrológica e acessos ao Protocolo.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Lado Esquerdo: Identidade e Créditos */}
          <div className="md:col-span-1 space-y-10">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C9A227] block mb-4">Acesso Oficial</span>
              <div className="flex items-center gap-4">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-14 h-14 rounded-full object-cover grayscale opacity-80" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-white/40" />
                  </div>
                )}
                <div>
                  <p className="text-white font-ps-display text-lg">{fullName || profile?.display_name || "Membro"}</p>
                  <p className="text-white/40 font-ps-ui text-xs">{profile?.email}</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-white/40 block mb-2">Créditos de Consulta</span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-ps-display text-5xl text-[#C9A227] leading-none">{profile?.credits ?? 0}</span>
                <span className="font-ps-ui text-xs text-[#C9A227]/60 uppercase tracking-widest">Saldo Atual</span>
              </div>
              <button
                onClick={() => navigate("/credits")}
                className="w-full py-3 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 hover:bg-[#C9A227]/20 transition-all font-sans text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Adquirir Mais Créditos
              </button>
            </motion.div>
            
            <button onClick={signOut} className="text-white/30 hover:text-white transition-colors text-[10px] font-sans uppercase tracking-[0.2em] pt-4 border-t border-white/10 w-full text-left">
              Sair do Sistema
            </button>
          </div>

          {/* Lado Direito: Formulário Natal e Histórico */}
          <div className="md:col-span-2 space-y-12">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="flex items-center gap-4 mb-6">
                 <h2 className="font-ps-display text-2xl text-white">Coordenadas de Nascimento</h2>
                 <div className="flex-1 h-px bg-white/10" />
              </div>
              <p className="text-white/50 font-ps-ui text-xs mb-8">Defina seus dados uma vez. O sistema carregará sua identidade astral automaticamente em todas as próximas consultas.</p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-2 block">Nome para a Consulta</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Seu nome completo" className="quantum-input w-full border-b border-white/20 pb-3 pt-2 text-lg text-white placeholder:text-white/20 focus:border-[#C9A227] bg-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-2 block">Data</label>
                    <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="quantum-input w-full border-b border-white/20 pb-3 pt-2 text-lg text-white focus:border-[#C9A227] bg-transparent" />
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-2 block">Hora Exata</label>
                    <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} className="quantum-input w-full border-b border-white/20 pb-3 pt-2 text-lg text-white focus:border-[#C9A227] bg-transparent" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-[#C9A227] mb-2 block">Cidade de Origem</label>
                  <CityAutocomplete
                    value={birthCity}
                    onChange={(v, valid, coords) => {
                      setBirthCity(v);
                      setBirthCityValid(valid);
                      if (coords) setBirthCoords(coords);
                    }}
                    placeholder="Digite e selecione na lista"
                    className="w-full text-lg border-b border-white/20 bg-transparent pb-3 pt-2 text-white focus:border-[#C9A227] focus:ring-0 transition-colors rounded-none"
                  />
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full md:w-auto mt-4 px-8 py-4 bg-white text-black hover:bg-gray-200 disabled:bg-white/10 disabled:text-white/30 transition-all font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Gravar Coordenadas"}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-ps-display text-xl text-white">Consultas Recentes</h2>
                <button onClick={() => navigate("/history")} className="text-[#C9A227] text-[10px] uppercase tracking-widest hover:text-white transition-colors">Acessar Arquivo →</button>
              </div>
              
              {recent.length === 0 ? (
                <p className="text-white/40 text-sm font-ps-ui">Nenhum dossiê gerado ainda.</p>
              ) : (
                <div className="space-y-3">
                  {recent.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors rounded-lg group">
                      <div>
                        <p className="text-white font-ps-display text-sm group-hover:text-[#C9A227] transition-colors">{c.name} · {c.year}</p>
                        <p className="text-white/40 font-ps-ui text-[10px] uppercase tracking-widest mt-1">{c.mode}{c.origin ? ` · ${c.origin}` : ""}</p>
                      </div>
                      <p className="text-white/30 font-ps-ui text-[10px]">{new Date(c.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
