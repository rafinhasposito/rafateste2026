import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, Scroll, User, ChevronLeft, Crown, Coins } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

export function MobileAppChrome() {
  const { session, profile } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const showBottomBar = [
    "/",
    "/meu-passado",
    "/consultar",
    "/v1-arquivo",
    "/casas",
    "/history",
    "/perfil",
    "/tecnologia",
    "/dashboard",
    "/v3-preview",
  ].some(
    (p) => location.pathname === p || (p === "/v3-preview" && location.pathname.startsWith("/v3-preview"))
  );

  const isHousesGuide = location.pathname.startsWith("/casas");
  const isHome = location.pathname === "/" || location.pathname === "/consultar";

  return (
    <>
      {/* Top Header — Unified Celestial Obsidian Glass */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 pt-3 pb-2.5 bg-[#060911]/90 backdrop-blur-xl pointer-events-none border-b border-white/[0.07]">
        {/* Left Side */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {!showBottomBar ? (
            <button
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B111E]/95 border border-white/15 text-[#F8FAFC] active:scale-95 transition-all text-xs font-sans font-semibold shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-[#EAB344]" />
              <span>{t.nav.back}</span>
            </button>
          ) : (
            <Link to="/" className="flex items-center active:opacity-80 transition-opacity">
              <img
                src="/brand/protocolo-solar-logo-horizontal.svg"
                alt="Protocolo Solar"
                className="w-[136px] h-auto opacity-95 drop-shadow-sm"
                draggable={false}
              />
            </Link>
          )}
        </div>

        {/* Right Side Actions: Language + Credits/SignIn */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <LanguageSwitcher compact />

          {session ? (
            <Link
              to="/credits"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/12 text-[#F3DC9B] text-[11px] font-mono font-semibold active:scale-95 transition-all backdrop-blur-xl"
            >
              <Coins className="w-3.5 h-3.5 text-[#EAB344]" />
              <span>{profile?.credits ?? 0}</span>
            </Link>
          ) : (
            <Link
              to="/auth?mode=signin"
              className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#EAB344]/35 bg-[#EAB344]/12 text-[#F3DC9B] text-[11px] font-sans font-semibold active:scale-95 transition-all backdrop-blur-xl"
            >
              {t.nav.signIn}
            </Link>
          )}
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      {showBottomBar && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] shadow-[0_-8px_30px_rgba(0,0,0,0.7)]"
          style={{
            background: "rgba(6, 9, 17, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
          }}
        >
          <div className="flex items-center justify-around h-16 px-2">
            {/* 1. Descobrir */}
            <Link
              to="/"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                isHome ? "text-[#F3DC9B]" : "text-[#B0BCCF] hover:text-white"
              )}
            >
              {isHome && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#EAB344] to-transparent rounded-full" />
              )}
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium tracking-wide">{t.nav.discover}</span>
            </Link>

            {/* 2. As 12 Casas */}
            <Link
              to="/casas"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                isHousesGuide ? "text-[#F3DC9B]" : "text-[#B0BCCF] hover:text-white"
              )}
            >
              {isHousesGuide && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#EAB344] to-transparent rounded-full" />
              )}
              <Crown className="w-5 h-5 text-[#EAB344]" />
              <span className="text-[10px] font-sans font-semibold tracking-wide">{t.nav.houses}</span>
            </Link>

            {/* 3. Consultas */}
            <Link
              to="/history"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                location.pathname === "/history" ? "text-[#F3DC9B]" : "text-[#B0BCCF] hover:text-white"
              )}
            >
              {location.pathname === "/history" && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#EAB344] to-transparent rounded-full" />
              )}
              <Scroll className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium tracking-wide">{t.nav.myConsultations}</span>
            </Link>

            {/* 4. Conta */}
            <Link
              to="/perfil"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                location.pathname === "/perfil" ? "text-[#F3DC9B]" : "text-[#B0BCCF] hover:text-white"
              )}
            >
              {location.pathname === "/perfil" && (
                <div className="absolute top-0 w-8 h-[2px] bg-gradient-to-r from-transparent via-[#EAB344] to-transparent rounded-full" />
              )}
              <User className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium tracking-wide">{t.nav.account}</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
