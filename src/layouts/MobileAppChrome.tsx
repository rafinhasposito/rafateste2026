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
      {/* Top Header — Official Brand Kit V2 Void Glass */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-6 pt-3 pb-2.5 bg-[#02050A]/90 backdrop-blur-xl pointer-events-none border-b border-[#C9A227]/12">
        {/* Left Side */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {!showBottomBar ? (
            <button
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#07101A]/95 border border-[#C9A227]/25 text-[#F2F4F7] active:scale-95 transition-all text-xs font-sans font-medium"
            >
              <ChevronLeft className="w-4 h-4 text-[#C9A227]" />
              <span>{t.nav.back}</span>
            </button>
          ) : (
            <Link to="/" className="flex items-center active:opacity-80 transition-opacity">
              <img
                src="/brand/protocolo-solar-logo-horizontal-4096.png"
                alt="Protocolo Solar"
                className="w-[148px] h-auto opacity-95"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C9A227]/35 bg-[#07101A] text-[#E8D59B] text-[11px] font-sans font-semibold active:scale-95 transition-all"
            >
              <Coins className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>{profile?.credits ?? 0}</span>
            </Link>
          ) : (
            <Link
              to="/auth?mode=signin"
              className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#C9A227] text-[#02050A] text-[11px] font-sans font-semibold active:scale-95 transition-all"
            >
              {t.nav.signIn}
            </Link>
          )}
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      {showBottomBar && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#C9A227]/14 shadow-[0_-8px_30px_rgba(0,0,0,0.7)]"
          style={{
            background: "rgba(2, 5, 10, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
          }}
        >
          <div className="flex items-center justify-around h-16 px-2">
            {/* 1. Descobrir (Solar Ring — zero compass per Brand Manual V2) */}
            <Link
              to="/"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                isHome ? "text-[#E8D59B]" : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              )}
            >
              {isHome && (
                <div className="absolute top-0 w-8 h-[1.5px] bg-[#C9A227]" />
              )}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="8.5" />
                <circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-[10px] font-sans font-medium tracking-wide">{t.nav.discover}</span>
            </Link>

            {/* 2. As 12 Casas */}
            <Link
              to="/casas"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                isHousesGuide ? "text-[#E8D59B]" : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              )}
            >
              {isHousesGuide && (
                <div className="absolute top-0 w-8 h-[1.5px] bg-[#C9A227]" />
              )}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="3" x2="12" y2="8" />
                <line x1="12" y1="16" x2="12" y2="21" />
                <line x1="3" y1="12" x2="8" y2="12" />
                <line x1="16" y1="12" x2="21" y2="12" />
              </svg>
              <span className="text-[10px] font-sans font-medium tracking-wide">{t.nav.houses}</span>
            </Link>

            {/* 3. Consultas */}
            <Link
              to="/history"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                location.pathname === "/history" ? "text-[#E8D59B]" : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              )}
            >
              {location.pathname === "/history" && (
                <div className="absolute top-0 w-8 h-[1.5px] bg-[#C9A227]" />
              )}
              <Scroll className="w-5 h-5 stroke-[1.6]" />
              <span className="text-[10px] font-sans font-medium tracking-wide">{t.nav.myConsultations}</span>
            </Link>

            {/* 4. Conta */}
            <Link
              to="/perfil"
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors relative",
                location.pathname === "/perfil" ? "text-[#E8D59B]" : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              )}
            >
              {location.pathname === "/perfil" && (
                <div className="absolute top-0 w-8 h-[1.5px] bg-[#C9A227]" />
              )}
              <User className="w-5 h-5 stroke-[1.6]" />
              <span className="text-[10px] font-sans font-medium tracking-wide">{t.nav.account}</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
