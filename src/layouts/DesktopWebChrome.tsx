import { Link, useLocation, useNavigate } from "react-router-dom";
import { Coins, LogOut, Settings, BookOpen } from "lucide-react";
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
  const location = useLocation();
  
  const credits = profile?.credits ?? 0;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 h-20 z-50"
      style={{
        background: "rgba(2, 5, 10, 0.86)",
        backdropFilter: "blur(24px) saturate(1.3)",
        WebkitBackdropFilter: "blur(24px) saturate(1.3)",
        borderBottom: "1px solid rgba(201, 162, 39, 0.14)",
      }}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
        
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <img
              src="/brand/protocolo-solar-logo-horizontal-4096.png"
              alt="Protocolo Solar"
              className="w-[290px] h-auto opacity-95 hover:opacity-100 transition-opacity drop-shadow-md"
              draggable={false}
            />
          </Link>

          <nav className="flex items-center gap-7">
            <Link 
              to="/" 
              className={`text-sm font-ps-ui font-medium transition-colors ${
                location.pathname === "/" ? "text-[#F5DE98]" : "text-white/65 hover:text-white"
              }`}
            >
              Descobrir
            </Link>
            <Link 
              to="/tecnologia" 
              className={`text-sm font-ps-ui font-medium transition-colors ${
                location.pathname === "/tecnologia" ? "text-[#F5DE98]" : "text-white/65 hover:text-white"
              }`}
            >
              Como Funciona
            </Link>
            {session && (
              <Link 
                to="/history" 
                className={`text-sm font-ps-ui font-medium transition-colors ${
                  location.pathname === "/history" ? "text-[#F5DE98]" : "text-white/65 hover:text-white"
                }`}
              >
                Consultas Anteriores
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3.5">
          <Link
            to="/app/onboarding"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#C9A227]/40 text-white/80 hover:text-[#F5DE98] text-xs font-ps-ui font-medium transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Guia Rápido</span>
          </Link>

          {session ? (
            <>
              {/* Luxury Gold Credits Pill */}
              <Link to="/credits">
                <div className="flex items-center gap-2 bg-[#0A1322]/90 border border-[#C9A227]/35 rounded-full px-3.5 py-1.5 hover:border-[#C9A227]/70 hover:bg-[#101E36] transition-all shadow-[0_0_16px_rgba(201,162,39,0.12)]">
                  <Coins className="w-4 h-4 text-[#E5C158]" />
                  <span className="text-sm font-ps-ui font-semibold text-[#F5DE98]">
                    {credits}
                  </span>
                </div>
              </Link>

              {/* User Avatar / Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full border border-[#C9A227]/45 object-cover shadow-[0_0_12px_rgba(201,162,39,0.18)]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#0A1322] border border-[#C9A227]/35 flex items-center justify-center">
                        <span className="text-[#F5DE98] text-xs font-bold">{profile?.display_name?.charAt(0) || "?"}</span>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#07101C]/98 backdrop-blur-2xl border border-[#C9A227]/25 text-white shadow-2xl">
                  <DropdownMenuLabel className="font-ps-ui text-white/90 truncate">
                    {profile?.display_name || profile?.email || "Minha Conta"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate("/app/onboarding")} className="text-[#F5DE98] hover:bg-white/5 focus:bg-white/5 focus:text-[#F5DE98] cursor-pointer flex justify-between">
                    <span>Guia Rápido</span>
                    <span className="text-[9px] uppercase opacity-60">6 passos</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/perfil")} className="text-white/85 hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer">
                    <Settings className="w-4 h-4 mr-2 text-[#C9A227]" />
                    Minha Conta
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="text-[#F5DE98] font-bold hover:bg-white/5 focus:bg-white/5 cursor-pointer">
                      Painel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-5 py-2 rounded-full border border-[#C9A227]/45 bg-[#C9A227]/12 hover:bg-[#C9A227]/25 text-[#F5DE98] text-xs font-ps-ui uppercase tracking-[0.16em] font-semibold transition-all"
            >
              Entrar
            </button>
          )}
        </div>
        
      </div>
    </header>
  );
}
