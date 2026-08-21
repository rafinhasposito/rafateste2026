import { Outlet, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import StarryBackground from "@/components/StarryBackground";
import { Button } from "@/components/ui/button";

export function FocusedShell() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-foundation-bg font-sans selection:bg-brand-primary/30">
      <StarryBackground />

      {/* 
        Header Minimalista
        Sempre visível, mas sem navegação global, mantendo o usuário focado.
      */}
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

      {/* Conteúdo focado - o Outlet preserva estado. */}
      <main className="relative z-10 w-full h-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
