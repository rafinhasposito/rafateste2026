import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StarryBackground from "@/components/StarryBackground";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase places a recovery session in the hash; onAuthStateChange picks it up
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Senhas não conferem"); return; }
    if (password.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Senha atualizada");
    navigate("/", { replace: true });
  };

  return (
    <>
      <StarryBackground />
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-8 max-w-md w-full">
          <h1 className="font-cinzel text-xl font-bold text-foreground uppercase tracking-wider mb-2 text-center">Nova Senha</h1>
          <p className="text-muted-foreground text-xs text-center mb-6">Defina uma nova senha para sua conta</p>
          {!ready ? (
            <p className="text-muted-foreground text-sm text-center">Aguardando link de recuperação…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="password" required minLength={6} placeholder="Nova senha" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background/40 border border-border focus:border-primary/50 outline-none text-foreground text-sm" />
              <input type="password" required minLength={6} placeholder="Confirmar senha" value={confirm} onChange={e => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background/40 border border-border focus:border-primary/50 outline-none text-foreground text-sm" />
              <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-primary text-background font-bold text-sm uppercase tracking-widest disabled:opacity-50">
                {busy ? "..." : "Atualizar senha"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;
