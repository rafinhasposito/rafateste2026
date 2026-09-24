import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, Scroll, User, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function MobileAppChrome() {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // The bottom bar appears on Main App routes: Index, History, Profile
  const showBottomBar = ["/", "/history", "/perfil"].includes(location.pathname);

  // On step=1 (Temporal Selection at "/"), the TemporalSelection component
  // renders its own brand header. We render the shell header only on sub-pages
  // or when the chrome's brand mark is needed for orientation.

  // If not logged in, show minimal top header with logo
  if (!session) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-5 pt-8 pb-4 flex items-center justify-between pointer-events-none">
        <Link to="/" className="pointer-events-auto">
          <img
            src="/brand/protocolo-solar-logo-horizontal.svg"
            alt="Protocolo Solar"
            className="w-[200px] h-auto opacity-95 drop-shadow-md"
            draggable={false}
          />
        </Link>
        <Link 
          to="/tecnologia" 
          className="pointer-events-auto text-[10px] uppercase tracking-widest text-brand-primary border border-brand-primary/20 bg-brand-primary/10 px-3 py-1.5 rounded-full backdrop-blur-md"
        >
          Tecnologia
        </Link>
      </header>
    );
  }

  return (
    <>
      {/* Top Header — Contextual */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-5 pt-8 pb-4 bg-gradient-to-b from-[#02050A]/90 to-transparent pointer-events-none">
        {!showBottomBar ? (
          /* Sub-page: show Back button */
          <button
            onClick={() => navigate(-1)}
            className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-[#0C1826]/80 backdrop-blur-md border border-white/10 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          /* Main tabs: show logo */
          <img
            src="/brand/protocolo-solar-logo-horizontal.svg"
            alt="Protocolo Solar"
            className="w-[280px] h-auto pointer-events-auto opacity-95 drop-shadow-sm"
            draggable={false}
          />
        )}
      </header>

      {/* Bottom Navigation */}
      {showBottomBar && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] pb-safe"
          style={{ background: "rgba(7,16,26,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center justify-around h-16 px-4">
            <Link
              to="/"
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                location.pathname === "/" ? "text-[#C9A227]" : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              )}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-ps-ui font-medium">Descobrir</span>
            </Link>

            <Link
              to="/history"
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                location.pathname === "/history" ? "text-[#C9A227]" : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              )}
            >
              <Scroll className="w-5 h-5" />
              <span className="text-[10px] font-ps-ui font-medium">Consultas</span>
            </Link>

            <Link
              to="/perfil"
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                location.pathname === "/perfil" ? "text-[#C9A227]" : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              )}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-ps-ui font-medium">Conta</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
