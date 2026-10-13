import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Coins, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  user_id: string;
  email: string | null;
  display_name: string | null;
  full_name: string | null;
  credits: number;
  created_at: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<Profile | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, email, display_name, full_name, credits, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      toast.error("Erro ao carregar usuários");
      console.error(error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const openModal = (user: Profile) => {
    setTargetUser(user);
    setAmount("");
    setReason("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTargetUser(null);
  };

  const handleSubmitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount === 0) {
      toast.error("A quantidade deve ser diferente de zero.");
      return;
    }
    if (!reason.trim()) {
      toast.error("O motivo é obrigatório.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.rpc("admin_adjust_credits", {
      p_target_user_id: targetUser.user_id,
      p_amount: numAmount,
      p_reason: reason.trim()
    });

    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Erro ao ajustar créditos.");
      console.error(error);
    } else {
      toast.success("Créditos ajustados com sucesso!");
      // Otimistic update
      setUsers(prev => prev.map(u =>
        u.user_id === targetUser.user_id
          ? { ...u, credits: u.credits + numAmount }
          : u
      ));
      closeModal();
    }
  };

  const filteredUsers = users.filter(u => {
    const term = searchQuery.toLowerCase();
    const name = (u.full_name || u.display_name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="font-ps-display text-xl text-white uppercase tracking-wider">Gestão de Usuários</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-background/50 border border-white/10 text-white px-10 py-2.5 rounded-xl focus:outline-none focus:border-primary/50 font-ps-ui text-sm placeholder:text-white/50/50 transition-colors"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="border border-white/10 rounded-xl bg-[#0a0a0a]/20 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-white/50 font-ps-ui animate-pulse">Carregando base de usuários...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-white/50 font-ps-ui">Nenhum usuário encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table (hidden on small screens) */}
            <table className="w-full text-left hidden md:table font-ps-ui text-sm">
              <thead className="bg-muted/30 text-white/50 border-b border-white/10 uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4 font-medium">Usuário</th>
                  <th className="px-6 py-4 font-medium">Data de Cadastro</th>
                  <th className="px-6 py-4 font-medium text-right">Saldo Atual</th>
                  <th className="px-6 py-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.map(user => (
                  <tr key={user.user_id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-amber-500">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-white">{user.full_name || user.display_name || "Sem Nome"}</div>
                          <div className="text-white/50 text-xs">{user.email || "Sem e-mail"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/50/80">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${user.credits > 0 ? "text-[#C9A227]" : "text-white/50"}`}>
                        {user.credits} cr
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(user)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2 px-3 py-1.5 border border-primary/30 text-amber-500 hover:bg-primary/10 rounded-lg text-xs uppercase tracking-widest font-bold"
                      >
                        <Coins size={14} /> Ajustar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile List (hidden on md+ screens) */}
            <div className="flex flex-col md:hidden divide-y divide-border/50 font-ps-ui">
              {filteredUsers.map(user => (
                <div key={user.user_id} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white truncate">{user.full_name || user.display_name || "Sem Nome"}</div>
                      <div className="text-white/50 text-xs truncate">{user.email || "Sem e-mail"}</div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className={`font-bold ${user.credits > 0 ? "text-[#C9A227]" : "text-white/50"}`}>
                        {user.credits} cr
                      </div>
                      <div className="text-white/50/50 text-[10px]">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(user)}
                    className="w-full flex justify-center items-center gap-2 py-2.5 border border-white/10 bg-background text-white hover:bg-muted/50 rounded-lg text-xs uppercase tracking-widest font-bold mt-1"
                  >
                    <Coins size={14} /> Ajustar Créditos
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Adjustment Modal */}
      <AnimatePresence>
        {isModalOpen && targetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#030306]/80 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0A0F] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>

              <h3 className="font-ps-display text-xl uppercase tracking-wider text-white mb-1">Ajuste de Crédito</h3>
              <p className="text-white/50 text-sm font-ps-ui mb-6">
                Para: <strong className="text-white font-medium">{targetUser.email}</strong>
              </p>

              <form onSubmit={handleSubmitAdjustment} className="space-y-4 font-ps-ui">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Quantidade (±)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Ex: 5 ou -5"
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#C9A227]/50 focus:bg-white/10 transition-colors"
                  />
                  <p className="text-[10px] text-white/30 mt-1.5 ml-1">
                    Use números positivos para adicionar e negativos para estornar.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Motivo / Justificativa</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Obrigatório para auditoria..."
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#C9A227]/50 focus:bg-white/10 transition-colors"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3.5 border border-white/10 text-white hover:bg-white/5 rounded-xl text-xs uppercase tracking-[0.1em] font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-white text-black hover:bg-white/90 rounded-xl text-xs uppercase tracking-[0.1em] font-bold disabled:opacity-50 transition-colors"
                  >
                    {submitting ? "Processando..." : "Confirmar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { UsersTable };
export default UsersTable;
