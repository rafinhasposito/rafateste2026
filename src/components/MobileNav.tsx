import { useLocation, useNavigate } from "react-router-dom";
import { Compass, LayoutGrid, CreditCard, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { to: "/", label: "Início", icon: Compass },
  { to: "/history", label: "Meus Mapas", icon: LayoutGrid },
  { to: "/credits", label: "Créditos", icon: CreditCard },
  { to: "/perfil", label: "Perfil", icon: User },
];

/** Barra de navegação inferior — visível apenas em telas de celular. */
const MobileNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  if (!user) return null;
  if (["/auth", "/reset-password"].includes(pathname)) return null;

  return (
    <nav className="mobile-nav md:hidden" aria-label="Navegação principal">
      {items.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to)}
            aria-current={active ? "page" : undefined}
            className={`mobile-nav-item ${active ? "is-active" : ""}`}
          >
            <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.2 : 1.7} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
