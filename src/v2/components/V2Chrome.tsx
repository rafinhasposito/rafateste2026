import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LOCALE_OPTIONS, useI18n, type SupportedLocale } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { V2_UI } from "../data/housesV2";

export type V2Tab = "home" | "free" | "houses" | "credits" | "consult" | "account" | "guide";

interface V2ChromeProps {
  activeTab: V2Tab;
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
        <Link className={`v2-nav-link${activeTab === "consult" ? " active" : ""}`} to="/v2/consultar">Consultar</Link>
        <Link className={`v2-nav-link${activeTab === "free" ? " active" : ""}`} to="/v2/consulta-gratis">{ui.navFree}</Link>
        <Link className={`v2-nav-link${activeTab === "credits" ? " active" : ""}`} to="/v2/creditos">{ui.navCredits}</Link>
        <Link className={`v2-nav-link${activeTab === "guide" ? " active" : ""}`} to="/v2/como-funciona">Como Funciona</Link>
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
          <Link className="v2-pill-btn v2-pill-dark" to="/v2/perfil">
            {typeof profile?.credits === "number" ? `${profile.credits} cr · Conta` : "Minha Conta"}
          </Link>
        ) : (
          <Link className="v2-pill-btn v2-pill-dark" to="/v2/entrar">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}

export function V2IosTabBar({ activeTab }: { activeTab: V2Tab }) {
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
        <span>Grátis</span>
      </Link>
      <Link className={activeTab === "consult" || activeTab === "houses" ? "on" : ""} to={isHome ? "/v2/consultar" : "/v2/consultar"}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span>Consultar</span>
      </Link>
      <Link className={activeTab === "credits" || activeTab === "account" ? "on" : ""} to="/v2/creditos">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <rect x="2" y="5" width="20" height="14" rx="2.5" />
          <path d="M2 10h20" />
        </svg>
        <span>{ui.navCredits}</span>
      </Link>
    </nav>
  );
}

export function V2Footer() {
  return (
    <footer
      style={{
        background: "#0B101B",
        color: "rgba(255,248,230,0.76)",
        padding: "44px min(4vw, 56px) calc(96px + env(safe-area-inset-bottom, 0px))",
        borderTop: "1px solid rgba(245,217,147,0.14)"
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <Link to="/v2" style={{ fontFamily: "'Marcellus', Georgia, serif", fontSize: 16, letterSpacing: "0.16em", textTransform: "uppercase", color: "#FFF8E6", textDecoration: "none" }}>
            ✦ Protocolo Solar
          </Link>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 13, fontWeight: 600 }}>
            <Link to="/v2/consultar" style={{ color: "inherit", textDecoration: "none" }}>Consultar</Link>
            <Link to="/v2/consulta-gratis" style={{ color: "inherit", textDecoration: "none" }}>Consulta Grátis</Link>
            <Link to="/v2/creditos" style={{ color: "inherit", textDecoration: "none" }}>Créditos</Link>
            <Link to="/v2/resgatar" style={{ color: "inherit", textDecoration: "none" }}>Resgatar Cupom</Link>
            <Link to="/v2/como-funciona" style={{ color: "inherit", textDecoration: "none" }}>Como Funciona</Link>
            <Link to="/v2/parceiros" style={{ color: "inherit", textDecoration: "none" }}>Parceiros</Link>
            <Link to="/v2/perfil" style={{ color: "inherit", textDecoration: "none" }}>Minha Conta</Link>
            <Link to="/v2/termos" style={{ color: "inherit", textDecoration: "none" }}>Termos</Link>
            <Link to="/v2/privacidade" style={{ color: "inherit", textDecoration: "none" }}>Privacidade</Link>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,248,230,0.48)", lineHeight: 1.55 }}>
          © {new Date().getFullYear()} Protocolo Solar · Cálculo astronômico Swiss Ephemeris · Ferramenta cultural e informativa (18+), sem promessa determinística.
        </div>
      </div>
    </footer>
  );
}
