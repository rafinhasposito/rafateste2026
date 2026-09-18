import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StarryBackground from "@/components/StarryBackground";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Mode = "signin" | "signup" | "forgot";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });
    if (error) toast.error("Erro no login com Google");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
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
      <>
        <StarryBackground />
        <div className="min-h-[100dvh] flex items-center justify-center">
          <div className="text-primary font-ps-display text-lg animate-pulse">Verificando sessão...</div>
        </div>
      </>
    );
  }
  if (user) return null;

  return (
    <>
      <StarryBackground />
      <div className="min-h-[100dvh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ps-surface p-8 md:p-12 max-w-[480px] w-full border border-ps-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl"
        >
          <div className="text-center mb-6">
            <img 
              src="/brand/protocolo-solar-logo-horizontal-4096.png" 
              alt="Protocolo Solar" 
              className="h-10 mx-auto mb-4 object-contain" 
            />
            <p className="text-ps-muted text-[10px] uppercase tracking-[0.25em] font-ps-ui font-medium">
              O GPS do seu novo ciclo
            </p>
            <p className="text-ps-muted text-xs mt-4 leading-relaxed font-ps-ui">
              {mode === "signup" 
                ? "Crie sua conta para salvar seus dados natais e não precisar preenchê-los em cada consulta." 
                : mode === "forgot" ? "Recupere sua senha" : "Acesse seu mapa cósmico e recupere seus dados."}
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-5 rounded-xl bg-white text-black font-ps-ui font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-3 hover:opacity-90 transition-opacity mb-4 shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ps-gold/20" />
            <span className="text-ps-muted text-[10px] uppercase tracking-widest font-ps-ui">ou</span>
            <div className="flex-1 h-px bg-ps-gold/20" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="text-left">
                <label className="font-ps-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-ps-gold mb-2 block">Nome Completo</label>
                <input
                  type="text" required placeholder="Seu nome completo" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-ps-night border border-ps-gold/30 text-ps-text p-3.5 rounded-xl focus:outline-none focus:border-ps-gold transition-colors font-ps-ui text-sm placeholder:text-ps-muted"
                />
              </div>
            )}
            <div className="text-left">
              <label className="font-ps-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-ps-gold mb-2 block">Email</label>
              <input
                type="email" required placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-ps-night border border-ps-gold/30 text-ps-text p-3.5 rounded-xl focus:outline-none focus:border-ps-gold transition-colors font-ps-ui text-sm placeholder:text-ps-muted"
              />
            </div>
            {mode !== "forgot" && (
              <div className="text-left">
                <label className="font-ps-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-ps-gold mb-2 block">Senha</label>
                <input
                  type="password" required placeholder="••••••••" minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-ps-night border border-ps-gold/30 text-ps-text p-3.5 rounded-xl focus:outline-none focus:border-ps-gold transition-colors font-ps-ui text-sm placeholder:text-ps-muted"
                />
                {mode === "signup" && (
                  <p className="text-ps-muted/60 text-[10px] mt-2 font-ps-ui leading-tight">
                    Mínimo de 8 caracteres. Evite senhas comuns. O sistema recusa senhas expostas em vazamentos de dados.
                  </p>
                )}
              </div>
            )}
            <button
              type="submit" disabled={busy}
              className="w-full h-14 mt-8 bg-ps-gold text-ps-night hover:opacity-90 shadow-[0_4px_24px_rgba(201,162,39,0.50)] disabled:opacity-50 transition-all font-ps-ui text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 rounded-xl"
            >
              {busy ? (
                <div className="w-4 h-4 border-2 border-ps-night/30 border-t-ps-night rounded-full animate-spin" />
              ) : null}
              {busy ? "Processando..." : mode === "signup" ? "Criar conta estelar" : mode === "forgot" ? "Enviar link" : "Entrar no Protocolo"}
            </button>
          </form>

          <div className="flex justify-between mt-6 text-xs font-ps-ui">
            {mode !== "signin" ? (
              <button onClick={() => setMode("signin")} className="text-ps-muted hover:text-ps-text transition-colors">← Voltar ao login</button>
            ) : (
              <>
                <button onClick={() => setMode("signup")} className="text-ps-muted hover:text-ps-text transition-colors">Criar conta</button>
                <button onClick={() => setMode("forgot")} className="text-ps-muted hover:text-ps-text transition-colors">Esqueci a senha</button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;
