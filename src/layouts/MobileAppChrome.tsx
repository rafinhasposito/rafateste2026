import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, Scroll, User, ChevronLeft, Sparkles, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function MobileAppChrome() {
  const { session, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // The bottom bar appears on main app views
  const showBottomBar = ["/", "/history", "/perfil", "/tecnologia"].includes(location.pathname);

  const isHome = location.pathname === "/";
  const isTecnologia = location.pathname === "/tecnologia";
  const isOnboarding = location.pathname === "/app/onboarding";

  return (
    <>
      {/* Top Header — Luxury Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 pt-3.5 pb-2.5 bg-gradient-to-b from-[#02050A]/95 via-[#02050A]/80 to-transparent backdrop-blur-md pointer-events-none border-b border-white/[0.04]">
        {/* Left Side */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {!showBottomBar ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0C1826]/90 backdrop-blur-xl border border-white/15 text-white active:scale-95 transition-all text-xs font-ps-ui uppercase tracking-wider font-semibold shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-[#F5DE98]" />
              <span>Voltar</span>
            </button>
          ) : (
            <Link to="/" className="flex items-center active:opacity-80 transition-opacity">
              <img
                src="/brand/protocolo-solar-logo-horizontal.svg"
                alt="Protocolo Solar"
                className="w-[140px] h-auto opacity-95 drop-shadow-sm"
                draggable={false}
              />
            </Link>
          )}
        </div>

        {/* Right Side Actions: Como Funciona & Ver Onboarding */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {!isTecnologia && (
            <Link
              to="/tecnologia"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#F5DE98] text-[10px] font-ps-ui uppercase tracking-[0.14em] font-semibold active:scale-95 transition-all shadow-[0_0_12px_rgba(201,162,39,0.18)] backdrop-blur-xl"
            >
              <Sparkles className="w-3 h-3 text-[#E5C158]" />
              <span>Como Funciona</span>
            </Link>
          )}

          {!isOnboarding && (
            <Link
              to="/app/onboarding"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-white/90 hover:text-white text-[10px] font-ps-ui uppercase tracking-[0.14em] font-medium active:scale-95 transition-all backdrop-blur-xl"
            >
              <BookOpen className="w-3 h-3 text-[#C9A227]" />
              <span>Onboarding</span>
            </Link>
          )}
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      {showBottomBar && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.7)]"
          style={{
            background: "rgba(5, 10, 18, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center justify-around h-16 px-2">
            {/* 1. Descobrir */}
            <Link
              to="/"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                isHome ? "text-[#F5DE98]" : "text-[#8E9CAE] hover:text-white"
              )}
            >
              {isHome && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent rounded-full" />
              )}
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-ps-ui font-medium tracking-wide">Descobrir</span>
            </Link>

            {/* 2. Consultas */}
            <Link
              to="/history"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                location.pathname === "/history" ? "text-[#F5DE98]" : "text-[#8E9CAE] hover:text-white"
              )}
            >
              {location.pathname === "/history" && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent rounded-full" />
              )}
              <Scroll className="w-5 h-5" />
              <span className="text-[10px] font-ps-ui font-medium tracking-wide">Consultas</span>
            </Link>

            {/* 3. Como Funciona */}
            <Link
              to="/tecnologia"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                isTecnologia ? "text-[#F5DE98]" : "text-[#8E9CAE] hover:text-white"
              )}
            >
              {isTecnologia && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent rounded-full" />
              )}
              <Sparkles className="w-5 h-5 text-[#C9A227]" />
              <span className="text-[10px] font-ps-ui font-medium tracking-wide">Como Funciona</span>
            </Link>

            {/* 4. Conta */}
            <Link
              to="/perfil"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                location.pathname === "/perfil" ? "text-[#F5DE98]" : "text-[#8E9CAE] hover:text-white"
              )}
            >
              {location.pathname === "/perfil" && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent rounded-full" />
              )}
              <User className="w-5 h-5" />
              <span className="text-[10px] font-ps-ui font-medium tracking-wide">Conta</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
