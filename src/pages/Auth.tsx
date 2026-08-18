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
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error("Erro no login com Google");
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
      toast.error((err as Error).message);
    } finally { setBusy(false); }
  };

  if (loading) {
    return (
      <>
        <StarryBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-primary font-cinzel text-lg animate-pulse">Verificando sessão...</div>
        </div>
      </>
    );
  }
  if (user) return null;

  return (
    <>
      <StarryBackground />
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel glass-panel-glow p-8 md:p-12 max-w-md w-full border border-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-dark/20 to-transparent border border-gold/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <svg width="36" height="36" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="22" stroke="#D4AF37" strokeWidth="0.75" strokeOpacity="0.4" strokeDasharray="2 2" />
                <polygon points="26,8 28.5,23.5 26,22 23.5,23.5" fill="#D4AF37" />
                <polygon points="26,44 28.5,28.5 26,30 23.5,28.5" fill="#D4AF37" fillOpacity="0.7" />
                <polygon points="8,26 23.5,23.5 22,26 23.5,28.5" fill="#D4AF37" fillOpacity="0.7" />
                <polygon points="44,26 28.5,23.5 30,26 28.5,28.5" fill="#D4AF37" fillOpacity="0.7" />
                <circle cx="26" cy="26" r="3" fill="#D4AF37" />
              </svg>
            </div>
            <h1 className="font-cinzel text-xl md:text-2xl font-bold text-foreground uppercase tracking-[0.12em]">Protocolo Solar</h1>
            <p className="text-[#D4AF37] text-[9px] uppercase tracking-[0.25em] font-medium mt-1">Astrologia de Relocalização</p>
            <p className="text-muted-foreground text-xs mt-3">
              {mode === "signup" ? "Crie sua conta estelar" : mode === "forgot" ? "Recupere sua senha" : "Acesse seu mapa cósmico"}
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-5 rounded-2xl bg-[#FAF7EE] text-[#030306] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-3 hover:opacity-90 transition-opacity mb-4 shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar com Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-muted-foreground text-[10px] uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <input
                type="text" placeholder="Seu nome completo" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border/80 focus:border-gold/60 outline-none text-foreground text-sm transition-colors"
              />
            )}
            <input
              type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border/80 focus:border-gold/60 outline-none text-foreground text-sm transition-colors"
            />
            {mode !== "forgot" && (
              <input
                type="password" required placeholder="Senha" minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border/80 focus:border-gold/60 outline-none text-foreground text-sm transition-colors"
              />
            )}
            <button
              type="submit" disabled={busy}
              className="btn-gold-luxury w-full py-3.5 text-xs tracking-[0.15em] mt-2 disabled:opacity-50"
            >
              {busy ? "Processando..." : mode === "signup" ? "Criar conta estelar" : mode === "forgot" ? "Enviar link" : "Entrar no Protocolo"}
            </button>
          </form>

          {/* Botão de Bypass para Testes Locais */}
          <button
            onClick={() => navigate('/showcase-onboarding')}
            className="w-full py-3 mt-3 rounded-xl border border-primary/30 text-primary font-bold text-sm uppercase tracking-widest hover:bg-primary/10 transition-all"
          >
            Pular Login (Testar Game)
          </button>

          <div className="flex justify-between mt-5 text-xs">
            {mode !== "signin" ? (
              <button onClick={() => setMode("signin")} className="text-muted-foreground hover:text-primary transition-colors">← Voltar ao login</button>
            ) : (
              <>
                <button onClick={() => setMode("signup")} className="text-muted-foreground hover:text-primary transition-colors">Criar conta</button>
                <button onClick={() => setMode("forgot")} className="text-muted-foreground hover:text-primary transition-colors">Esqueci a senha</button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;
