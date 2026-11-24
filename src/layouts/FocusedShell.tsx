import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function FocusedShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const isOnboarding = location.pathname === "/app/onboarding";

  return (
    <div className="relative min-h-[100dvh] bg-[#060911] font-sans selection:bg-[#EAB344]/30">
      {!isOnboarding && <StarryBackground />}

      {!isOnboarding && (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 bg-gradient-to-b from-[#060911]/92 via-[#060911]/60 to-transparent pointer-events-none">
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0B111E]/92 backdrop-blur-xl border border-white/15 hover:border-[#EAB344]/50 text-[#F8FAFC] active:scale-95 transition-all text-xs font-sans font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          >
            <ChevronLeft className="w-4 h-4 text-[#EAB344]" />
            <span>{t.nav.back}</span>
          </button>

          <div className="pointer-events-auto">
            <LanguageSwitcher compact />
          </div>
        </header>
      )}

      <main className="relative z-10 w-full h-full min-h-[100dvh]">
        <Outlet />
      </main>
    </div>
  );
}
