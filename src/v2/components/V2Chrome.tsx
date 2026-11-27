import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LOCALE_OPTIONS, useI18n, type SupportedLocale } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { V2_UI } from "../data/housesV2";

interface V2ChromeProps {
  activeTab: "home" | "free" | "houses" | "credits";
  backTo?: { label: string; to: string };
}

export function V2TopNav({ activeTab, backTo }: V2ChromeProps) {
  const { locale, setLocale } = useI18n();
  const { user, profile } = useAuth();
  const ui = V2_UI[locale] || V2_UI.pt;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`v2-nav${scrolled ? " scrolled" : ""}`} aria-label="Navegação Protocolo Solar V2">
      {backTo ? (
        <Link className="v2-pill-btn" to={backTo.to}>{backTo.label}</Link>
      ) : (
        <Link className="v2-brand" to="/v2">
          <span className="v2-brand-mark" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="#C9A227" strokeWidth="1.3" />
              <path d="M12 4.5 Q12 12 19.5 12 Q12 12 12 19.5 Q12 12 4.5 12 Q12 12 12 4.5Z" fill="#C9A227" />
            </svg>
          </span>
          <span className="v2-brand-name">Protocolo Solar</span>
        </Link>
      )}

      <div className="v2-nav-center">
        <Link className={`v2-nav-link${activeTab === "home" ? " active" : ""}`} to="/v2">{ui.navHome}</Link>
        <Link className={`v2-nav-link${activeTab === "houses" ? " active" : ""}`} to="/v2#colecao">{ui.navHouses}</Link>
        <Link className={`v2-nav-link${activeTab === "free" ? " active" : ""}`} to="/v2/consulta-gratis">{ui.navFree}</Link>
        <Link className={`v2-nav-link${activeTab === "credits" ? " active" : ""}`} to="/v2#creditos">{ui.navCredits}</Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          aria-label="Idioma"
          className="v2-lang-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value as SupportedLocale)}
        >
          {LOCALE_OPTIONS.map((opt) => (
            <option key={opt.code} value={opt.code}>{opt.short}</option>
          ))}
        </select>

        {user ? (
          <Link className="v2-pill-btn v2-pill-dark" to="/perfil">
            {typeof profile?.credits === "number" ? `${profile.credits} cr · Conta` : "Minha Conta"}
          </Link>
        ) : (
          <Link className="v2-pill-btn v2-pill-dark" to="/v2/consulta-gratis">
            {ui.navFree}
          </Link>
        )}
      </div>
    </nav>
  );
}

export function V2IosTabBar({ activeTab }: { activeTab: "home" | "free" | "houses" | "credits" }) {
  const { locale } = useI18n();
  const ui = V2_UI[locale] || V2_UI.pt;
  const location = useLocation();
  const isHome = location.pathname === "/v2";

  return (
    <nav className="v2-ios-tabbar" aria-label="Navegação inferior">
      <Link className={activeTab === "home" ? "on" : ""} to="/v2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
        </svg>
        <span>{ui.navHome}</span>
      </Link>
      <Link className={activeTab === "free" ? "on" : ""} to="/v2/consulta-gratis">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        <span>{ui.navFree.split(" ")[0]}</span>
      </Link>
      <Link className={activeTab === "houses" ? "on" : ""} to={isHome ? "#colecao" : "/v2#colecao"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span>{ui.navHouses}</span>
      </Link>
      <Link className={activeTab === "credits" ? "on" : ""} to={isHome ? "#creditos" : "/v2#creditos"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="2" y="5" width="20" height="14" rx="2.5" />
          <path d="M2 10h20" />
        </svg>
        <span>{ui.navCredits}</span>
      </Link>
    </nav>
  );
}
