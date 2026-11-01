import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import { Button } from "@/components/ui/button";

export function FocusedShell() {
  const navigate = useNavigate();
  const location = useLocation();

  // Onboarding is fully immersive — no shell header, no starry background
  const isOnboarding = location.pathname === "/app/onboarding";

  return (
    <div className="relative min-h-[100dvh] bg-[#02050A] font-ps-ui selection:bg-[#C9A227]/30">
      {!isOnboarding && <StarryBackground />}

      {/* 
        Header Minimalista — hidden during onboarding (it has its own nav).
        Visible on other focused routes (auth, credits, etc.).
      */}
      {!isOnboarding && (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-[#02050A]/90 via-[#02050A]/50 to-transparent pointer-events-none">
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#08111F]/90 backdrop-blur-xl border border-[#C9A227]/25 hover:border-[#C9A227]/50 text-[#F5DE98] hover:text-white active:scale-95 transition-all text-[11px] font-ps-ui uppercase tracking-[0.14em] font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          >
            <ChevronLeft className="w-4 h-4 text-[#E5C158]" />
            <span>Voltar</span>
          </button>
        </header>
      )}

      {/* Conteúdo focado - o Outlet preserva estado. */}
      <main className="relative z-10 w-full h-full min-h-[100dvh]">
        <Outlet />
      </main>
    </div>
  );
}
