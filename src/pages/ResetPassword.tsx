import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    if (password !== confirm) { toast.error("As senhas não conferem."); return; }
    if (password.length < 8) { toast.error("Escolha uma senha com no mínimo 8 caracteres."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Senha atualizada com sucesso!");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 pt-20 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-[#08111F]/95 border border-[#C9A227]/30 backdrop-blur-xl p-7 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.75)]"
      >
        <h1 className="font-ps-display text-2xl sm:text-3xl font-bold text-white text-center mb-1.5">Nova Senha</h1>
        <p className="font-ps-ui text-white/60 text-xs sm:text-sm text-center mb-8">Defina uma nova senha segura para acessar sua conta.</p>
        {!ready ? (
          <div className="flex flex-col items-center justify-center py-6">
             <div className="w-6 h-6 border-2 border-[#C9A227]/30 border-t-[#C9A227] rounded-full animate-spin mb-3" />
             <p className="text-white/60 text-xs font-ps-ui uppercase tracking-widest">Validando link de recuperação...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label className="font-ps-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5DE98]/85 mb-1.5 block">Nova Senha (mín. 8 caracteres)</label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-base sm:text-sm placeholder:text-white/30"
              />
            </div>
            <div className="text-left">
              <label className="font-ps-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5DE98]/85 mb-1.5 block">Confirmar Nova Senha</label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full bg-[#040914]/90 border border-white/15 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C9A227] transition-all font-ps-ui text-base sm:text-sm placeholder:text-white/30"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full py-4 mt-3 rounded-xl bg-[#C9A227] hover:bg-[#E5C158] text-[#02050A] disabled:opacity-40 transition-all font-ps-ui text-xs uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(201,162,39,0.28)]"
            >
              {busy ? <div className="w-4 h-4 border-2 border-[#02050A]/30 border-t-[#02050A] rounded-full animate-spin" /> : null}
              {busy ? "Atualizando..." : "Salvar Nova Senha"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
