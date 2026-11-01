import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from '@/components/ui/BackButton';
import { motion } from "framer-motion";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TERMS_VERSION, PRIVACY_VERSION, TERMS_TEXT, PRIVACY_TEXT } from "@/constants/legal";

type Mode = "signin" | "signup" | "forgot";

async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      // Process pending acceptance if arriving from OAuth redirect
      const processPendingTerms = async () => {
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
        navigate("/", { replace: true });
      };
      processPendingTerms();
    }
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    if (mode === "signup" && !acceptedTerms) {
      toast.error("Você precisa aceitar os Termos de Uso e a Política de Privacidade para criar sua conta.");
      return;
    }

    // Store intent so useEffect processes it upon redirect back (only for new accounts)
    if (mode === "signup") {
      localStorage.setItem("pending_terms_acceptance", "true");
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      }
    });
    if (error) toast.error("Erro no login com Google");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !acceptedTerms) {
      toast.error("Você precisa aceitar os Termos e a Privacidade para criar sua conta.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;

        // Explicitly record acceptance for email signup right now
        if (data?.user?.id) {
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
        }

        toast.success("Conta criada! Verifique seu email para confirmar.");
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
        toast.error("Essa senha é muito fraca ou já apareceu em vazamentos. Escolha uma senha mais segura com letras e números.");
      } else if (message.includes("Invalid login")) {
        toast.error("Email ou senha incorretos.");
      } else {
        toast.error(message);
      }
    } finally { setBusy(false); }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#02050A] flex items-center justify-center">
        <div className="text-[#F5DE98]/70 font-ps-ui text-xs tracking-widest uppercase animate-pulse">
          Verificando sua conta...
        </div>
      </div>
    );
  }
  if (user) return null;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-16 sm:py-20 overflow-hidden selection:bg-[#C9A227]/30">
      {/* Subtle Ambient Gold Halo over FocusedShell's StarryBackground */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[620px] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.12)_0%,transparent_70%)] blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] rounded-3xl bg-[#08111F]/90 border border-[#C9A227]/25 backdrop-blur-xl p-6 sm:p-9 shadow-[0_24px_70px_rgba(0,0,0,0.65)] flex flex-col items-center"
      >
        {/* Brand & Hook — Responsive height so form fits above the fold on Mobile & Web */}
        <div className="text-center mb-7 w-full">
          <img
            src="/brand/protocolo-solar-logo-vertical.svg"
            alt="Protocolo Solar"
            className="h-24 sm:h-28 mx-auto mb-5 object-contain opacity-95 drop-shadow-[0_6px_20px_rgba(201,162,39,0.18)]"
          />
          <h1 className="font-ps-display text-2xl sm:text-3xl text-white font-bold leading-tight mb-2">
            {mode === "signup" ? "Crie sua conta gratuita" : mode === "forgot" ? "Recuperar sua senha" : "Bem-vindo de volta"}
          </h1>
          <p className="font-ps-ui text-white/60 text-xs sm:text-sm leading-relaxed">
            {mode === "signup"
              ? "Salve seus dados de nascimento e descubra onde passar seu aniversário."
              : mode === "forgot"
              ? "Digite seu e-mail para receber o link de redefinição."
              : "Entre para acessar suas consultas e calcular novas cidades."}
          </p>
        </div>

        {/* Primary Action: Google */}
        {mode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-13 py-3.5 bg-white/[0.06] hover:bg-white/[0.11] border border-white/15 hover:border-[#C9A227]/40 text-white rounded-xl font-ps-ui text-xs font-semibold uppercase tracking-[0.14em] flex items-center justify-center gap-3 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar com Google
            </button>

            <div className="flex items-center gap-4 w-full my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-white/15" />
              <span className="text-white/45 text-[10px] uppercase tracking-[0.22em] font-ps-ui">ou com e-mail</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/15 to-white/15" />
            </div>
          </>
        )}

        {/* Traditional Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5 w-full">
          {mode === "signup" && (
            <div className="text-left w-full">
              <input
                type="text" required placeholder="Seu nome completo" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm placeholder:text-white/35"
              />
            </div>
          )}
          <div className="text-left w-full">
            <input
              type="email" required placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm placeholder:text-white/35"
            />
          </div>
          {mode !== "forgot" && (
            <div className="text-left w-full">
              <input
                type="password" required placeholder="Sua senha (mín. 8 caracteres)" minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-sm placeholder:text-white/35"
              />
            </div>
          )}

          {/* Terms Checkbox - ONLY ON SIGNUP */}
          {mode === "signup" && (
            <div className="flex items-start gap-3 pt-2 pb-1 px-0.5">
              <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="peer absolute w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-4 h-4 border border-white/35 rounded bg-[#040914] peer-checked:bg-[#C9A227] peer-checked:border-[#C9A227] transition-all flex items-center justify-center">
                  <svg className={`w-3 h-3 text-[#02050A] pointer-events-none transition-opacity ${acceptedTerms ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <label htmlFor="terms" className="text-white/55 text-xs font-ps-ui leading-relaxed select-none cursor-pointer">
                Li e concordo com os <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-[#F5DE98] hover:underline underline-offset-4">Termos de Uso</a> e a <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-[#F5DE98] hover:underline underline-offset-4">Política de Privacidade</a>.
              </label>
            </div>
          )}

          <button
            type="submit" disabled={busy || (mode === "signup" && !acceptedTerms)}
            className="w-full py-4 mt-2 bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] hover:scale-[1.01] active:scale-95 shadow-[0_10px_28px_rgba(201,162,39,0.28)] disabled:opacity-35 disabled:hover:scale-100 disabled:shadow-none transition-all duration-300 font-ps-ui text-xs uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2.5 rounded-xl"
          >
            {busy ? (
              <div className="w-4 h-4 border-2 border-[#02050A]/30 border-t-[#02050A] rounded-full animate-spin" />
            ) : null}
            {busy ? "Entrando..." : mode === "signup" ? "Criar Minha Conta" : mode === "forgot" ? "Enviar Link de Recuperação" : "Entrar"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="flex justify-center items-center gap-4 mt-7 text-[11px] font-ps-ui tracking-[0.14em] uppercase">
          {mode !== "signin" ? (
            <BackButton label="Voltar ao login" onClick={() => setMode("signin")} />
          ) : (
            <>
              <button onClick={() => setMode("signup")} className="text-[#F5DE98]/85 hover:text-white font-semibold transition-colors">
                Criar Conta
              </button>
              <span className="text-white/15">•</span>
              <button onClick={() => setMode("forgot")} className="text-white/50 hover:text-white transition-colors">
                Esqueci a senha
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
