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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel glass-panel-glow p-8 md:p-12 max-w-md w-full border border-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <h1 className="font-cinzel text-xl md:text-2xl font-bold text-foreground uppercase tracking-[0.12em] text-center mb-1">Nova Senha</h1>
          <p className="text-muted-foreground text-xs text-center mb-8">Defina uma nova senha para sua conta</p>
          {!ready ? (
            <div className="flex flex-col items-center justify-center py-4">
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mb-3" />
               <p className="text-white/60 text-xs font-sans uppercase tracking-widest">Aguardando autorização...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="text-left">
                <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-1 block">Nova Senha</label>
                <input type="password" required minLength={6} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                  className="quantum-input w-full" />
              </div>
              <div className="text-left">
                <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-1 block">Confirmar Senha</label>
                <input type="password" required minLength={6} placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)}
                  className="quantum-input w-full" />
              </div>
              <button type="submit" disabled={busy} className="w-full h-14 mt-6 bg-white text-black hover:bg-gray-200 disabled:bg-white/10 disabled:text-white/30 transition-all font-sans text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                {busy ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : null}
                {busy ? "Atualizando..." : "Atualizar senha"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;
