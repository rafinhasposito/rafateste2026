import { Link, useNavigate } from "react-router-dom";
import { User, Coins, LogOut, Settings, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsAdmin } from "@/hooks/useIsAdmin";


export function DesktopWebChrome() {
  const { session, profile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  
  const credits = profile?.credits ?? 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 z-50"
      style={{
        background: "rgba(3,3,6,0.85)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img
              src="/brand/protocolo-solar-logo-horizontal-4096.png"
              alt="Protocolo Solar"
              className="h-8 w-auto opacity-95 hover:opacity-100 transition-opacity"
              draggable={false}
            />
          </Link>

          {/* Center-ish: Navigation (Only if logged in) */}
          {session && (
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className="text-sm font-sans font-medium text-foundation-muted-fg hover:text-foundation-fg transition-colors"
              >
                Nova Consulta
              </Link>
              <Link 
                to="/history" 
                className="text-sm font-sans font-medium text-foundation-muted-fg hover:text-foundation-fg transition-colors"
              >
                Consultas Anteriores
              </Link>
            </nav>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {/* Credits Pill */}
              <Link to="/credits">
                <div className="flex items-center gap-2 bg-surface-elevated border border-brand-primary/20 rounded-full px-3 py-1.5 hover:border-brand-primary/40 transition-colors">
                  <Coins className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-sans font-medium text-foundation-fg">
                    {credits}
                  </span>
                </div>
              </Link>

              {/* User Avatar / Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full border border-brand-primary/20 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-secondary border border-surface-border flex items-center justify-center">
                        <span className="text-brand-primary text-xs font-bold">{profile?.display_name?.charAt(0) || "?"}</span>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-surface-elevated border-surface-border">
                  <DropdownMenuLabel className="font-sans text-foundation-fg truncate">
                    {profile?.display_name || profile?.email || "Minha Conta"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-surface-border" />
                  <DropdownMenuItem onClick={() => navigate("/app/onboarding")} className="text-brand-primary hover:bg-surface focus:bg-surface cursor-pointer flex justify-between">
                    <span>Ver Onboarding</span>
                    <span className="text-[9px] uppercase opacity-60">6 telas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/perfil")} className="text-foundation-fg hover:bg-surface focus:bg-surface cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Meu Perfil
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="text-brand-primary font-bold hover:bg-surface focus:bg-surface cursor-pointer">
                      Painel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-surface-border" />
                  <DropdownMenuItem onClick={handleLogout} className="text-status-error hover:text-status-error hover:bg-status-error/10 focus:bg-status-error/10 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")} variant="outline" className="font-sans">
              Entrar
            </Button>
          )}
        </div>
        
      </div>
    </header>
  );
}
