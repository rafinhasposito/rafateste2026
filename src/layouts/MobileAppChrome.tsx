import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, Scroll, User, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function MobileAppChrome() {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in, we only show a minimal top header
  if (!session) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between pointer-events-none">
        <span className="font-display font-bold text-lg text-brand-primary tracking-wider drop-shadow-md pointer-events-auto">
          PROTOCOLO SOLAR
        </span>
      </header>
    );
  }

  // Determine if we should show the bottom bar based on current route
  // The bottom bar appears on Main App routes: Index, History, Profile
  const showBottomBar = ["/", "/history", "/perfil"].includes(location.pathname);

  return (
    <>
      {/* Top Header - Contextual */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center p-4 bg-gradient-to-b from-foundation-bg/90 to-transparent pointer-events-none">
        {/* If we are NOT on a main tab, show a Back button */}
        {!showBottomBar ? (
          <button 
            onClick={() => navigate(-1)}
            className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-surface-elevated/80 backdrop-blur-md border border-surface-border text-foundation-fg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <span className="font-display font-bold text-lg text-brand-primary tracking-wider drop-shadow-md pointer-events-auto">
            PROTOCOLO SOLAR
          </span>
        )}
      </header>

      {/* Bottom Navigation */}
      {showBottomBar && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-elevated/90 backdrop-blur-xl border-t border-surface-border pb-safe">
          <div className="flex items-center justify-around h-16 px-4">
            <Link 
              to="/" 
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                location.pathname === "/" ? "text-brand-primary" : "text-foundation-muted-fg hover:text-foundation-fg"
              )}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium">Descobrir</span>
            </Link>

            <Link 
              to="/history" 
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                location.pathname === "/history" ? "text-brand-primary" : "text-foundation-muted-fg hover:text-foundation-fg"
              )}
            >
              <Scroll className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium">Consultas</span>
            </Link>

            <Link 
              to="/perfil" 
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                location.pathname === "/perfil" ? "text-brand-primary" : "text-foundation-muted-fg hover:text-foundation-fg"
              )}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-sans font-medium">Conta</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
