import { Link, useLocation, useNavigate } from "react-router-dom";
import { Coins, LogOut, Settings, BookOpen, Handshake, Crown } from "lucide-react";
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
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";


export function DesktopWebChrome() {
  const { session, profile } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { isAffiliate } = useIsAffiliate();
  const { t } = useI18n();
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
        background: "rgba(2, 5, 10, 0.88)",
        backdropFilter: "blur(24px) saturate(1.2)",
        WebkitBackdropFilter: "blur(24px) saturate(1.2)",
        borderBottom: "1px solid rgba(201, 162, 39, 0.14)",
      }}
    >
      <div className="max-w-[1240px] mx-auto h-full flex items-center justify-between px-6 lg:px-8">
        
        {/* Left: Official Logo + Clean Typographic Navigation */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/brand/protocolo-solar-logo-horizontal-4096.png"
              alt="Protocolo Solar"
              className="w-[228px] h-auto opacity-95 hover:opacity-100 transition-opacity"
              draggable={false}
            />
          </Link>

          <nav className="flex items-center gap-7">
            <Link 
              to="/" 
              className={`text-[13px] font-sans tracking-[0.04em] whitespace-nowrap transition-colors ${
                location.pathname === "/" && !location.search.includes("mode=")
                  ? "text-[#E8D59B] font-medium"
                  : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              }`}
            >
              {t.nav.home}
            </Link>
            <Link 
              to="/casas" 
              className={`text-[13px] font-sans tracking-[0.04em] whitespace-nowrap transition-colors ${
                location.pathname.startsWith("/casas")
                  ? "text-[#E8D59B] font-medium"
                  : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              }`}
            >
              {t.nav.houses}
            </Link>
            <Link 
              to="/consultar" 
              className={`text-[13px] font-sans tracking-[0.04em] whitespace-nowrap transition-colors ${
                location.pathname === "/consultar" || (location.pathname === "/" && location.search.includes("mode="))
                  ? "text-[#E8D59B] font-medium"
                  : "text-[#AAB6C4] hover:text-[#F2F4F7]"
              }`}
            >
              {t.nav.consult}
            </Link>
            {session && (
              <Link 
                to="/history" 
                className={`text-[13px] font-sans tracking-[0.04em] whitespace-nowrap transition-colors ${
                  location.pathname === "/history" ? "text-[#E8D59B] font-medium" : "text-[#AAB6C4] hover:text-[#F2F4F7]"
                }`}
              >
                {t.nav.myConsultations}
              </Link>
            )}
            {isAffiliate && (
              <Link 
                to="/afiliado" 
                className={`text-[13px] font-sans tracking-[0.04em] whitespace-nowrap transition-colors ${
                  location.pathname === "/afiliado"
                    ? "text-[#E8D59B] font-medium"
                    : "text-[#AAB6C4] hover:text-[#F2F4F7]"
                }`}
              >
                Painel Parceiro
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Language + Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <Link
            to="/app/onboarding"
            className="text-[12px] font-sans tracking-[0.06em] uppercase text-[#AAB6C4] hover:text-[#E8D59B] px-3 py-1.5 whitespace-nowrap transition-colors"
          >
            {t.nav.quickGuide}
          </Link>

          {session ? (
            <>
              <Link to="/credits">
                <div className="flex items-center gap-2 bg-[#07101A] border border-[#C9A227]/35 rounded-full px-3.5 py-1.5 hover:border-[#C9A227]/70 transition-all">
                  <Coins className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span className="text-xs font-sans font-semibold text-[#E8D59B]">
                    {credits}
                  </span>
                </div>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full border border-[#EAB344]/45 object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#0B111E] border border-[#EAB344]/35 flex items-center justify-center">
                        <span className="text-[#F3DC9B] text-xs font-bold">{profile?.display_name?.charAt(0) || "?"}</span>
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#0B111E]/98 backdrop-blur-2xl border border-white/14 text-white shadow-2xl rounded-2xl p-1.5">
                  <DropdownMenuLabel className="font-sans text-white/90 truncate">
                    {profile?.display_name || profile?.email || t.nav.myAccount}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => navigate("/app/onboarding")} className="text-[#F3DC9B] hover:bg-white/5 focus:bg-white/5 focus:text-[#F3DC9B] cursor-pointer flex justify-between rounded-xl">
                    <span>{t.nav.quickGuide}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/perfil")} className="text-white/90 hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer rounded-xl">
                    <Settings className="w-4 h-4 mr-2 text-[#EAB344]" />
                    {t.nav.myAccount}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/afiliado")} className="text-white/85 hover:bg-white/5 focus:bg-white/5 focus:text-white cursor-pointer rounded-xl">
                    <Handshake className="w-4 h-4 mr-2 text-[#EAB344]" />
                    {isAffiliate ? "Painel de Parceiro" : "Programa de Parceiros"}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="text-[#F3DC9B] font-bold hover:bg-white/5 focus:bg-white/5 cursor-pointer rounded-xl">
                      Painel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer rounded-xl">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t.nav.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-1.5 rounded-full bg-[#C9A227] hover:bg-[#D8B338] text-[#02050A] text-xs font-sans font-semibold tracking-[0.04em] whitespace-nowrap transition-all"
            >
              {t.nav.signIn}
            </button>
          )}
        </div>
        
      </div>
    </header>
  );
}
