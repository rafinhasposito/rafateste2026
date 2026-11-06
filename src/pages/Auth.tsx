import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackButton } from '@/components/ui/BackButton';
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, User as UserIcon, CheckCircle2, Mail, ArrowRight, Edit2 } from "lucide-react";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TERMS_VERSION, PRIVACY_VERSION, TERMS_TEXT, PRIVACY_TEXT } from "@/constants/legal";

type Mode = "signin" | "signup" | "forgot";

interface SunSignInfo {
  name: string;
  symbol: string;
  element: string;
}

export function getSunSignFromDate(dateStr: string): SunSignInfo | null {
  if (!dateStr || !dateStr.includes("-")) return null;
  const parts = dateStr.split("-");
  if (parts.length < 3) return null;
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (!month || !day) return null;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Áries", symbol: "♈", element: "Fogo" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Touro", symbol: "♉", element: "Terra" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "Gêmeos", symbol: "♊", element: "Ar" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Câncer", symbol: "♋", element: "Água" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Leão", symbol: "♌", element: "Fogo" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Virgem", symbol: "♍", element: "Terra" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Libra", symbol: "♎", element: "Ar" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Escorpião", symbol: "♏", element: "Água" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Sagitário", symbol: "♐", element: "Fogo" };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: "Capricórnio", symbol: "♑", element: "Terra" };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Aquário", symbol: "♒", element: "Ar" };
  return { name: "Peixes", symbol: "♓", element: "Água" };
}

async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const Auth = () => {
  const { user, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Default new visitors (from onboarding or ?setup=true) into the Guided Natal Passport flow
  const initialMode: Mode =
    searchParams.get("mode") === "signin"
      ? "signin"
      : "signup";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);

  // Natal Passport State (Step 1)
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [birthCityValid, setBirthCityValid] = useState(false);
  const [birthCoords, setBirthCoords] = useState<CityCoords | null>(null);

  // Account Credentials State (Step 2 / Signin)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Restore any previously calibrated Natal Passport from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ps_pending_natal_passport");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.full_name) setName(parsed.full_name);
        if (parsed.birth_date) setBirthDate(parsed.birth_date);
        if (parsed.birth_time) setBirthTime(parsed.birth_time);
        if (parsed.birth_city) {
          setBirthCity(parsed.birth_city);
          setBirthCityValid(true);
        }
        if (parsed.birth_lat && parsed.birth_lon) {
          setBirthCoords({ lat: parsed.birth_lat, lon: parsed.birth_lon });
        }
      }
    } catch {
      // ignore invalid storage
    }
  }, []);

  const sunSign = getSunSignFromDate(birthDate);

  useEffect(() => {
    if (!loading && user) {
      const finalizeLogin = async () => {
        // 1. Sync pending Natal Passport if present
        try {
          const pendingRaw = localStorage.getItem("ps_pending_natal_passport");
          if (pendingRaw) {
            const pending = JSON.parse(pendingRaw);
            if (pending && pending.full_name && pending.birth_date && pending.birth_time && pending.birth_city) {
              const parts = String(pending.birth_city).split(",").map((s: string) => s.trim());
              const country = parts.length > 1 ? parts[parts.length - 1] : null;
              await supabase
                .from("profiles")
                .update({
                  full_name: pending.full_name,
                  display_name: pending.full_name,
                  birth_date: pending.birth_date,
                  birth_time: pending.birth_time,
                  birth_city: pending.birth_city,
                  birth_country: country,
                  birth_lat: pending.birth_lat ?? null,
                  birth_lon: pending.birth_lon ?? null,
                })
                .eq("user_id", user.id);
              localStorage.removeItem("ps_pending_natal_passport");
              await refreshProfile();
            }
          }
        } catch (e) {
          console.error("Failed to save pending natal passport on auth:", e);
        }

        // 2. Process pending terms acceptance if arriving from OAuth redirect
        if (localStorage.getItem("pending_terms_acceptance") === "true") {
          localStorage.removeItem("pending_terms_acceptance");
          try {
            const termsHash = await sha256(TERMS_TEXT);
            const privacyHash = await sha256(PRIVACY_TEXT);
            await supabase.functions.invoke("record-terms-acceptance", {
              body: {
                user_id: user.id,
                terms_version: TERMS_VERSION,
                privacy_version: PRIVACY_VERSION,
                terms_hash: termsHash,
                privacy_hash: privacyHash,
              },
            });
          } catch (e) {
            console.error("Failed to record terms acceptance:", e);
          }
        }

        const previewPath = sessionStorage.getItem("ps_onboarding_v2_path");
        if (previewPath && ["cidade", "casa", "intencao"].includes(previewPath)) {
          sessionStorage.removeItem("ps_onboarding_v2_path");
          sessionStorage.removeItem("ps_pending_mode");
          navigate(`/?mode=futuro&path=${previewPath}`, { replace: true });
          return;
        }
        const pendingMode = sessionStorage.getItem("ps_pending_mode");
        if (pendingMode && ["futuro", "presente", "passado"].includes(pendingMode)) {
          sessionStorage.removeItem("ps_pending_mode");
          navigate(`/?mode=${pendingMode}`, { replace: true });
        } else {
          navigate("/?mode=futuro", { replace: true });
        }
      };
      finalizeLogin();
    }
  }, [user, loading, navigate, refreshProfile]);

  const handleAdvanceToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Informe como você gosta de ser chamado(a).");
      return;
    }
    if (!birthDate) {
      toast.error("Informe sua data de nascimento.");
      return;
    }
    if (!birthTime || birthTime === "00:00") {
      toast.error("Informe seu horário exato de nascimento (se for meia-noite, use 00:01).");
      return;
    }
    if (!birthCity.trim() || (!birthCityValid && !birthCity.includes(","))) {
      toast.error("Digite e selecione sua cidade de nascimento na lista de sugestões.");
      return;
    }

    const passportPayload = {
      full_name: name.trim(),
      birth_date: birthDate,
      birth_time: birthTime,
      birth_city: birthCity.trim(),
      birth_lat: birthCoords?.lat ?? null,
      birth_lon: birthCoords?.lon ?? null,
      sun_sign: sunSign?.name ?? null,
    };
    localStorage.setItem("ps_pending_natal_passport", JSON.stringify(passportPayload));
    setSignupStep(2);
  };

  const handleGoogleLogin = async () => {
    if (mode === "signup" && !acceptedTerms) {
      toast.error("Marque a caixinha concordando com os Termos de Uso logo acima para continuar.");
      return;
    }

    if (mode === "signup") {
      localStorage.setItem("pending_terms_acceptance", "true");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) toast.error("Erro no login com Google");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !acceptedTerms) {
      toast.error("Marque a caixinha concordando com os Termos e a Privacidade para salvar seu Passaporte.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { full_name: name.trim() || email.split("@")[0] },
          },
        });
        if (error) throw error;

        if (data?.user?.id) {
          try {
            const termsHash = await sha256(TERMS_TEXT);
            const privacyHash = await sha256(PRIVACY_TEXT);
            await supabase.functions.invoke("record-terms-acceptance", {
              body: {
                user_id: data.user.id,
                terms_version: TERMS_VERSION,
                privacy_version: PRIVACY_VERSION,
                terms_hash: termsHash,
                privacy_hash: privacyHash,
              },
            });
          } catch (e) {
            console.error("Failed to record terms acceptance:", e);
          }
        }

        // If Supabase returned an active session immediately (Confirm email OFF), useEffect will redirect!
        // If Confirm email is ON in Supabase (!data.session), show our clear Portuguese guidance screen!
        if (!data?.session) {
          setEmailConfirmationSent(true);
          toast.success("Passaporte salvo! Falta apenas confirmar seu acesso.");
        } else {
          toast.success("Passaporte Natal calibrado com sucesso!");
        }
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Email de recuperação enviado.");
        setMode("signin");
      }
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes("weak") || message.includes("Password should be")) {
        toast.error("Escolha uma senha mais segura com pelo menos 8 caracteres (letras e números).");
      } else if (message.includes("Invalid login")) {
        toast.error("E-mail ou senha incorretos.");
      } else if (message.includes("already registered")) {
        toast.error("Este e-mail já possui conta! Mudamos para a tela de Entrar para você acessar.");
        setMode("signin");
      } else {
        toast.error(message);
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#02050A] flex items-center justify-center">
        <div className="text-[#F5DE98]/70 font-ps-ui text-xs tracking-widest uppercase animate-pulse">
          Sincronizando seu Passaporte Astral...
        </div>
      </div>
    );
  }
  if (user) return null;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start sm:justify-center px-4 pt-20 pb-14 sm:py-20 selection:bg-[#C9A227]/30">
      {/* Subtle Ambient Gold Halo over FocusedShell's StarryBackground */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[620px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.14)_0%,transparent_70%)] blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[480px] rounded-3xl bg-[#08111F]/95 border border-[#C9A227]/30 backdrop-blur-xl p-5 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.75)] flex flex-col items-center"
      >
        {/* Top Mode Toggle Pills (New User Passport vs Returning User Login) */}
        {mode !== "forgot" && !emailConfirmationSent && (
          <div className="w-full grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-[#040914] border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`py-2.5 px-3 rounded-xl font-ps-ui text-[11px] uppercase tracking-[0.12em] font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === "signup"
                  ? "bg-[#C9A227] text-[#02050A] shadow-[0_4px_16px_rgba(201,162,39,0.3)]"
                  : "text-white/55 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Criar Passaporte</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`py-2.5 px-3 rounded-xl font-ps-ui text-[11px] uppercase tracking-[0.12em] font-bold transition-all flex items-center justify-center ${
                mode === "signin"
                  ? "bg-[#C9A227] text-[#02050A] shadow-[0_4px_16px_rgba(201,162,39,0.3)]"
                  : "text-white/55 hover:text-white"
              }`}
            >
              Já Tenho Conta
            </button>
          </div>
        )}

        {/* =====================================================================
            TELA ESPECIAL: E-MAIL DE CONFIRMAÇÃO ENVIADO (RESOLVE O PRINT 1)
           ===================================================================== */}
        {emailConfirmationSent ? (
          <div className="w-full text-center py-2 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#C9A227]/15 border border-[#C9A227]/40 flex items-center justify-center mx-auto text-[#F5DE98]">
              <Mail className="w-7 h-7" />
            </div>

            {sunSign && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/35 text-[#F5DE98] text-[11px] font-ps-ui font-semibold">
                <span>{sunSign.symbol}</span>
                <span>Passaporte de {name.split(" ")[0]} (Sol em {sunSign.name}) salvo!</span>
              </div>
            )}

            <div>
              <h2 className="font-ps-display text-2xl sm:text-3xl text-white font-bold mb-2">
                Falta só 1 clique no seu e-mail
              </h2>
              <p className="font-ps-ui text-white/70 text-xs sm:text-sm leading-relaxed">
                Enviamos um link de confirmação para <strong className="text-[#F5DE98]">{email}</strong>.
              </p>
            </div>

            <div className="text-left rounded-2xl bg-[#040914]/90 border border-white/12 p-4 space-y-2.5 text-xs font-ps-ui text-white/80">
              <p className="text-[#F5DE98] font-semibold uppercase tracking-[0.14em] text-[10px]">
                📬 Como ativar em 10 segundos:
              </p>
              <p>1. Abra seu e-mail (olhe também no Spam ou Promoções).</p>
              <p>
                2. Procure pela mensagem automática de <strong className="text-white">Supabase Auth</strong> com o título <strong className="text-white">"Confirm Your Signup"</strong>.
              </p>
              <p>
                3. Clique em <strong className="text-[#F5DE98]">"Confirm your mail"</strong> — você voltará direto para o seu mapa já calibrado!
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <p className="text-[11px] font-ps-ui text-white/55">
                Não quer esperar o e-mail chegar? Entre agora mesmo em 1 clique com o Google (seus dados natais já estão salvos):
              </p>
              <button
                type="button"
                onClick={() => {
                  setAcceptedTerms(true);
                  localStorage.setItem("pending_terms_acceptance", "true");
                  supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: { redirectTo: `${window.location.origin}/auth` },
                  });
                }}
                className="w-full py-3.5 px-4 bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] rounded-xl font-ps-ui text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2.5 shadow-[0_10px_28px_rgba(201,162,39,0.28)] transition-all"
              >
                <span>Entrar Agora com Google (Sem esperar e-mail)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmailConfirmationSent(false);
                  setMode("signin");
                }}
                className="text-white/50 hover:text-white text-[11px] font-ps-ui uppercase tracking-[0.15em] pt-2 block mx-auto"
              >
                Já confirmei meu e-mail → Ir para Login
              </button>
            </div>
          </div>
        ) : mode === "signup" ? (
          /* =====================================================================
             MODO GUIADO DE 1º ACESSO: PASSAPORTE NATAL (PASSO 1 -> PASSO 2)
             ===================================================================== */
          <div className="w-full">
            {/* Barra de Progresso Visual (Passo 1 de 2 / Passo 2 de 2) */}
            <div className="w-full mb-5">
              <div className="flex items-center justify-between text-[10px] font-ps-ui uppercase tracking-[0.18em] mb-2">
                <span className={signupStep === 1 ? "text-[#F5DE98] font-bold" : "text-emerald-400 font-semibold flex items-center gap-1"}>
                  {signupStep > 1 && <CheckCircle2 className="w-3.5 h-3.5 inline" />} 1. Dados de Nascimento
                </span>
                <span className={signupStep === 2 ? "text-[#F5DE98] font-bold" : "text-white/35"}>
                  2. Salvar Passaporte
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A227] to-[#F5DE98] transition-all duration-500 rounded-full"
                  style={{ width: signupStep === 1 ? "50%" : "100%" }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {signupStep === 1 ? (
                <motion.form
                  key="signup-step-1"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleAdvanceToStep2}
                  className="space-y-4 w-full"
                >
                  <div className="text-center mb-4">
                    <h1 className="font-ps-display text-2xl sm:text-3xl text-white font-bold leading-tight mb-1.5">
                      Calibre seu Passaporte Natal
                    </h1>
                    <p className="font-ps-ui text-white/65 text-xs sm:text-sm leading-relaxed">
                      Informe seus dados de nascimento uma única vez para o sistema calcular as coordenadas exatas do seu aniversário.
                    </p>
                  </div>

                  {/* Nome */}
                  <div className="text-left w-full">
                    <label className="block text-[10px] uppercase tracking-[0.18em] text-[#F5DE98]/85 font-ps-ui font-semibold mb-1.5">
                      Como você gosta de ser chamado(a)?
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#C9A227]/75 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Rafael Sposito"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[#040914]/90 border border-white/15 text-white pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {/* Data e Hora de Nascimento lado a lado */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <div className="text-left">
                      <label className="block text-[10px] uppercase tracking-[0.18em] text-[#F5DE98]/85 font-ps-ui font-semibold mb-1.5">
                        Data de Nascimento
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-[#C9A227]/75 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="date"
                          required
                          value={birthDate}
                          onChange={e => setBirthDate(e.target.value)}
                          className="w-full bg-[#040914]/90 border border-white/15 text-white pl-10 pr-3 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    <div className="text-left">
                      <label className="block text-[10px] uppercase tracking-[0.18em] text-[#F5DE98]/85 font-ps-ui font-semibold mb-1.5">
                        Horário Exato <span className="text-white/40 lowercase font-normal">(certidão)</span>
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-[#C9A227]/75 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="time"
                          required
                          value={birthTime}
                          onChange={e => setBirthTime(e.target.value)}
                          className="w-full bg-[#040914]/90 border border-white/15 text-white pl-10 pr-3 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recompensa Instantânea de Dopamina: Signo Solar Detectado */}
                  {sunSign && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full rounded-xl bg-gradient-to-r from-[#C9A227]/20 via-[#C9A227]/10 to-transparent border border-[#C9A227]/40 px-4 py-2.5 flex items-center gap-3"
                    >
                      <span className="text-xl leading-none">{sunSign.symbol}</span>
                      <div className="text-left">
                        <p className="text-[#F5DE98] font-ps-ui text-xs font-bold">
                          Sol em {sunSign.name} detectado!
                        </p>
                        <p className="text-white/65 font-ps-ui text-[11px]">
                          Elemento {sunSign.element} • Coordenada solar pronta para cálculo.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Cidade de Nascimento */}
                  <div className="text-left w-full">
                    <label className="block text-[10px] uppercase tracking-[0.18em] text-[#F5DE98]/85 font-ps-ui font-semibold mb-1.5">
                      Cidade onde você nasceu
                    </label>
                    <CityAutocomplete
                      value={birthCity}
                      onChange={(val, valid, coords) => {
                        setBirthCity(val);
                        setBirthCityValid(valid);
                        if (coords) setBirthCoords(coords);
                      }}
                      placeholder="Digite e escolha na lista (Ex: São Paulo, Brasil)"
                      className="py-3.5 bg-[#040914]/90 border-white/15"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 mt-3 bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] hover:scale-[1.01] active:scale-95 shadow-[0_10px_28px_rgba(201,162,39,0.32)] transition-all duration-300 font-ps-ui text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 rounded-xl"
                  >
                    <span>Continuar para Salvar Passaporte</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="signup-step-2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 w-full"
                >
                  {/* Resumo do Passaporte Calibrado */}
                  <div className="w-full rounded-2xl bg-[#040914]/95 border border-[#C9A227]/35 p-3.5 flex items-center justify-between gap-3">
                    <div className="text-left min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-ps-ui uppercase tracking-[0.16em] text-[#F5DE98] font-bold mb-0.5">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {name} {sunSign ? `• ${sunSign.symbol} Sol em ${sunSign.name}` : ""}
                        </span>
                      </div>
                      <p className="text-white/65 font-ps-ui text-[11px] truncate">
                        📍 {birthCity} • {birthDate.split("-").reverse().join("/")} às {birthTime}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="shrink-0 px-2.5 py-1.5 rounded-lg border border-white/15 hover:border-[#C9A227]/50 text-[#F5DE98] text-[10px] font-ps-ui uppercase tracking-wider flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <div className="text-center">
                    <h2 className="font-ps-display text-2xl sm:text-3xl text-white font-bold leading-tight mb-1">
                      Salve seu Passaporte Astral
                    </h2>
                    <p className="font-ps-ui text-white/65 text-xs leading-relaxed">
                      Vincule seu acesso gratuito para nunca mais precisar digitar seus dados natais e abrir o simulador.
                    </p>
                  </div>

                  {/* Checkbox de Termos Visível ANTES do Google e do E-mail */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#040914]/80 border border-white/10">
                    <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        id="terms-step2"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="peer absolute w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-4 h-4 border border-[#C9A227]/60 rounded bg-[#040914] peer-checked:bg-[#C9A227] peer-checked:border-[#C9A227] transition-all flex items-center justify-center">
                        <svg className={`w-3 h-3 text-[#02050A] pointer-events-none transition-opacity ${acceptedTerms ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 14 14" fill="none">
                          <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    <label htmlFor="terms-step2" className="text-white/75 text-xs font-ps-ui leading-snug select-none cursor-pointer text-left">
                      Concordo com os <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-[#F5DE98] underline underline-offset-2">Termos de Uso</a> e a <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-[#F5DE98] underline underline-offset-2">Política de Privacidade</a>.
                    </label>
                  </div>

                  {/* Opção 1: Google 1-Clique (Recomendado, sem confirmação de e-mail) */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-3.5 px-4 bg-white hover:bg-white/90 text-[#02050A] rounded-xl font-ps-ui text-xs font-bold uppercase tracking-[0.13em] flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_24px_rgba(255,255,255,0.12)] active:scale-95"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Salvar com Google (Acesso em 1 Clique)</span>
                  </button>

                  <div className="flex items-center gap-3 w-full my-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-white/15" />
                    <span className="text-white/45 text-[10px] uppercase tracking-[0.2em] font-ps-ui">ou salvar com e-mail</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-white/15" />
                  </div>

                  {/* Opção 2: E-mail e Senha */}
                  <form onSubmit={handleEmailSubmit} className="space-y-3 w-full">
                    <input
                      type="email"
                      required
                      placeholder="Digite seu melhor e-mail"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm placeholder:text-white/35"
                    />
                    <input
                      type="password"
                      required
                      placeholder="Crie uma senha (mín. 8 caracteres)"
                      minLength={8}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm placeholder:text-white/35"
                    />

                    <button
                      type="submit"
                      disabled={busy || !acceptedTerms}
                      className="w-full py-4 bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] hover:scale-[1.01] active:scale-95 shadow-[0_10px_28px_rgba(201,162,39,0.28)] disabled:opacity-35 disabled:hover:scale-100 disabled:shadow-none transition-all duration-300 font-ps-ui text-xs uppercase tracking-[0.16em] font-bold flex items-center justify-center gap-2 rounded-xl"
                    >
                      {busy && <div className="w-4 h-4 border-2 border-[#02050A]/30 border-t-[#02050A] rounded-full animate-spin" />}
                      <span>{busy ? "Salvando Passaporte..." : "Salvar Meu Passaporte e Entrar"}</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* =====================================================================
             MODO LOGIN ("JÁ TENHO CONTA") OU RECUPERAR SENHA
             ===================================================================== */
          <div className="w-full">
            <div className="text-center mb-6 w-full">
              <img
                src="/brand/protocolo-solar-logo-vertical.svg"
                alt="Protocolo Solar"
                className="h-20 sm:h-24 mx-auto mb-4 object-contain opacity-95 drop-shadow-[0_6px_20px_rgba(201,162,39,0.18)]"
              />
              <h1 className="font-ps-display text-2xl sm:text-3xl text-white font-bold leading-tight mb-1.5">
                {mode === "forgot" ? "Recuperar sua senha" : "Bem-vindo de volta"}
              </h1>
              <p className="font-ps-ui text-white/60 text-xs sm:text-sm leading-relaxed">
                {mode === "forgot"
                  ? "Digite seu e-mail para receber o link de redefinição."
                  : "Entre para acessar seu Passaporte Natal e simular novas cidades."}
              </p>
            </div>

            {mode === "signin" && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 hover:border-[#C9A227]/40 text-white rounded-xl font-ps-ui text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-3 transition-all duration-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continuar com Google
                </button>

                <div className="flex items-center gap-4 w-full my-5">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-white/15" />
                  <span className="text-white/45 text-[10px] uppercase tracking-[0.22em] font-ps-ui">ou com e-mail</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-white/15" />
                </div>
              </>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-3.5 w-full">
              <div className="text-left w-full">
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm placeholder:text-white/35"
                />
              </div>
              {mode !== "forgot" && (
                <div className="text-left w-full">
                  <input
                    type="password"
                    required
                    placeholder="Sua senha"
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm placeholder:text-white/35"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-4 mt-2 bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] hover:scale-[1.01] active:scale-95 shadow-[0_10px_28px_rgba(201,162,39,0.28)] disabled:opacity-35 transition-all duration-300 font-ps-ui text-xs uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2.5 rounded-xl"
              >
                {busy && <div className="w-4 h-4 border-2 border-[#02050A]/30 border-t-[#02050A] rounded-full animate-spin" />}
                <span>{busy ? "Entrando..." : mode === "forgot" ? "Enviar Link de Recuperação" : "Entrar na Minha Conta"}</span>
              </button>
            </form>

            <div className="flex justify-center items-center gap-4 mt-6 text-[11px] font-ps-ui tracking-[0.14em] uppercase">
              {mode === "forgot" ? (
                <BackButton label="Voltar ao login" onClick={() => setMode("signin")} />
              ) : (
                <>
                  <button onClick={() => setMode("signup")} className="text-[#F5DE98]/85 hover:text-white font-semibold transition-colors">
                    Criar Passaporte Natal
                  </button>
                  <span className="text-white/15">•</span>
                  <button onClick={() => setMode("forgot")} className="text-white/50 hover:text-white transition-colors">
                    Esqueci a senha
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;

