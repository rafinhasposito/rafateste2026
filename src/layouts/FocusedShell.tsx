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
    <div className="relative min-h-screen bg-foundation-bg font-sans selection:bg-brand-primary/30">
      {!isOnboarding && <StarryBackground />}

      {/* 
        Header Minimalista — hidden during onboarding (it has its own nav).
        Visible on other focused routes (auth, credits, etc.).
      */}
      {!isOnboarding && (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-foundation-bg/80 to-transparent">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="rounded-full text-foundation-fg hover:bg-surface-elevated/50"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </header>
      )}

      {/* Conteúdo focado - o Outlet preserva estado. */}
      <main className={`relative z-10 w-full h-full min-h-screen ${isOnboarding ? '' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}
