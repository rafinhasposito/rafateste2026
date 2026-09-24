import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Map as MapIcon, Scale, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileAppLayoutProps {
  children: React.ReactNode;
}

export const MobileAppLayout = ({ children }: MobileAppLayoutProps) => {
  const location = useLocation();

  const tabs = [
    { icon: Compass, label: "Resumo", path: "/app" },
    { icon: MapIcon, label: "Mapa", path: "/app/mapa" },
    { icon: Scale, label: "Comparar", path: "/app/comparar" },
    { icon: Heart, label: "Salvos", path: "/app/salvos" },
    { icon: User, label: "Perfil", path: "/app/perfil" },
  ];

  return (
    <div className="relative min-h-[100dvh] bg-[#0A0B10] text-[#F4F4F6] font-ps-ui overflow-hidden flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-quantum-900/20 via-[#0A0B10] to-[#0A0B10]"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0A0B10]/90 backdrop-blur-xl border-t border-white/5 pb-6 pt-3 px-6">
        <div className="flex items-center justify-between">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || (tab.path !== "/app" && location.pathname.startsWith(tab.path));
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-colors duration-300",
                  isActive ? "text-[#E5D3B3]" : "text-[#8E8D96] hover:text-[#E5D3B3]/70"
                )}
              >
                <Icon strokeWidth={isActive ? 2 : 1.5} className="w-6 h-6" />
                <span className="text-[10px] font-medium tracking-wide">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
