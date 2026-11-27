import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { V2TopNav, V2IosTabBar, V2Footer } from "../components/V2Chrome";
import "../v2.css";

export default function AuthV2() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const rawReturnTo = searchParams.get("returnTo");
  const safeReturnTo = rawReturnTo && rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : "/v2/perfil";

  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [name, setName] = useState(() => sessionStorage.getItem("ps_natal_name") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Entrar — Protocolo Solar";
    if (user) navigate(safeReturnTo, { replace: true });
  }, [user, navigate, safeReturnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "reset") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (err) throw err;
        setMessage("Enviamos um link de redefinição para o seu e-mail.");
        toast.success("Link enviado! Confira sua caixa de entrada.");
      } else if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { display_name: name.trim() || "Viajante" },
            emailRedirectTo: `${window.location.origin}${safeReturnTo}`
          }
        });
        if (err) throw err;
        toast.success("Conta criada com sucesso!");
        navigate(safeReturnTo, { replace: true });
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (err) throw err;
        toast.success("Bem-vindo de volta!");
        navigate(safeReturnTo, { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || "Não foi possível autenticar. Confira seus dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v2-root">
      <V2TopNav activeTab="account" backTo={{ label: "← Home", to: "/v2" }} />

      <main
        style={{
          minHeight: "100svh",
          background: "linear-gradient(155deg, #F4EAE0 0%, #E9DAC9 100%)",
          padding: "96px 20px 84px",
          display: "grid",
          placeItems: "center"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            background: "rgba(255,255,255,0.95)",
            border: "1.5px solid rgba(255,255,255,0.99)",
            borderRadius: 28,
            padding: "30px 24px",
            boxShadow: "0 30px 70px -24px rgba(16,22,34,0.22)"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A227", marginBottom: 8 }}>
              ✦ Passaporte Solar
            </div>
            <h1 className="v2-serif" style={{ fontSize: 32, lineHeight: 1.06, color: "#101622", marginBottom: 6 }}>
              {mode === "login" ? "Entrar na Sua Conta" : mode === "signup" ? "Criar Conta Gratuita" : "Recuperar Senha"}
            </h1>
            <p style={{ fontSize: 14, color: "#384357" }}>
              Seus créditos, mapas e histórico ficam salvos com segurança.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              padding: 4,
              borderRadius: 999,
              background: "#FAF6F0",
              marginBottom: 20
            }}
          >
            <button
              type="button"
              onClick={() => setMode("login")}
              style={{
                height: 40,
                border: 0,
                borderRadius: 999,
                background: mode === "login" ? "#101622" : "transparent",
                color: mode === "login" ? "#FFF8E6" : "#101622",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer"
              }}
            >
              Já tenho conta
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              style={{
                height: 40,
                border: 0,
                borderRadius: 999,
                background: mode === "signup" ? "#101622" : "transparent",
                color: mode === "signup" ? "#FFF8E6" : "#101622",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer"
              }}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "signup" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="authName" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                  Seu nome
                </label>
                <input
                  id="authName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Marina"
                  required
                  style={{ height: 50, padding: "0 14px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16 }}
                />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="authEmail" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                E-mail
              </label>
              <input
                id="authEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                required
                style={{ height: 50, padding: "0 14px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16 }}
              />
            </div>

            {mode !== "reset" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="authPass" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                  Senha
                </label>
                <input
                  id="authPass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  style={{ height: 50, padding: "0 14px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16 }}
                />
              </div>
            )}

            {error && (
              <div style={{ padding: "11px 14px", borderRadius: 12, background: "#FEF2F2", color: "#991B1B", fontSize: 13.5, fontWeight: 600 }}>
                {error}
              </div>
            )}
            {message && (
              <div style={{ padding: "11px 14px", borderRadius: 12, background: "#ECFDF5", color: "#065F46", fontSize: 13.5, fontWeight: 600 }}>
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="v2-specular-btn" style={{ width: "100%", marginTop: 6 }}>
              {loading
                ? "Conectando..."
                : mode === "login"
                  ? "Entrar agora →"
                  : mode === "signup"
                    ? "Criar minha conta →"
                    : "Enviar link de recuperação"}
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
            {mode !== "reset" ? (
              <button
                type="button"
                onClick={() => setMode("reset")}
                style={{ background: "none", border: 0, color: "#384357", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Esqueci minha senha
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode("login")}
                style={{ background: "none", border: 0, color: "#384357", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                Voltar para login
              </button>
            )}
            <Link to="/v2/consulta-gratis" style={{ fontSize: 13, fontWeight: 800, color: "#101622", textDecoration: "none" }}>
              Prefere testar grátis sem cadastro? →
            </Link>
          </div>
        </div>
      </main>

      <V2Footer />
      <V2IosTabBar activeTab="account" />
    </div>
  );
}
