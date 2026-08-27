import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TEST_MODE } from "@/lib/testMode";

const UserMenu = () => {
  const { user, profile, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-3 md:right-4 z-50 flex items-center gap-2 md:gap-3 safe-top"
    >
      {TEST_MODE ? (
        <span className="px-3 py-2 rounded-full border border-primary/30 bg-card/80 backdrop-blur-md text-primary text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
          Modo teste
        </span>
      ) : (
        <button
          onClick={() => navigate("/credits")}
          aria-label="Meus créditos"
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-primary/20 bg-card/80 backdrop-blur-md hover:border-primary/40 transition-all"
        >
          <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 18V6" />
          </svg>
          <span className="text-primary font-bold text-xs">{profile?.credits ?? 0}</span>
        </button>
      )}

      {/* No celular a navegação fica na barra inferior */}
      <button
        onClick={() => navigate("/history")}
        aria-label="Meus mapas"
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-md hover:border-primary/30 transition-all"
      >
        <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
        <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Meus Mapas</span>
      </button>

      <div className="relative" ref={wrapRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Abrir menu da conta"
          className="block"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover transition-all"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center transition-all">
              <span className="text-primary text-xs font-bold">{profile?.display_name?.charAt(0) || "?"}</span>
            </div>
          )}
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl p-2 shadow-xl"
          >
            <p className="text-foreground text-xs font-medium px-3 py-2 truncate">{profile?.display_name || profile?.email}</p>
            <div className="h-px bg-border my-1" />
            <button onClick={() => { setOpen(false); navigate("/perfil"); }} className="w-full text-left px-3 py-3 md:py-2 text-foreground text-xs hover:bg-primary/10 rounded-lg transition-colors">
              Meu Perfil
            </button>
            {isAdmin && (
              <button onClick={() => { setOpen(false); navigate("/admin"); }} className="w-full text-left px-3 py-3 md:py-2 text-primary text-xs hover:bg-primary/10 rounded-lg transition-colors">
                Painel Admin
              </button>
            )}
            {!TEST_MODE && (
              <button
                onClick={signOut}
                className="w-full text-left px-3 py-3 md:py-2 text-destructive text-xs hover:bg-destructive/10 rounded-lg transition-colors"
              >
                Sair
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserMenu;
