import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n, type Locale } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import GradientText from "../components/reactbits/GradientText";
import { V2Footer } from "../components/V2Chrome";
import { mountHome3D } from "../components/mountHome3D";
import "../styles/home3d.css";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" }
];

export default function HomeV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { locale, setLocale } = useI18n();
  const { user, credits } = useAuth();

  useEffect(() => {
    document.title = "Protocolo Solar — Onde Passar Seu Aniversário";
    const root = rootRef.current;
    if (!root) return undefined;

    const cleanup = mountHome3D(root, {
      onOpenHouse: (houseId) => navigate(`/v2/casas/${houseId}`),
      onOpenFreeAudit: () => navigate("/v2/consulta-gratis"),
      onBuyPackage: (pkg) => navigate(`/v2/creditos?pkg=${pkg}`)
    });

    return cleanup;
  }, [navigate]);

  return (
    <div className="v2-home3d" ref={rootRef}>
      <canvas id="gl" aria-hidden="true" />

      {/* Persistent Navigation (Desktop top pill + Mobile WhatsApp-style fixed iOS Bottom Tab Bar) */}
      <nav id="nav" aria-label="Navegação principal">
        <a className="brand" href="#casas">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="#C9A227" strokeWidth="1.3" />
              <path d="M12 4.5 Q12 12 19.5 12 Q12 12 12 19.5 Q12 12 4.5 12 Q12 12 12 4.5Z" fill="#C9A227" />
            </svg>
          </span>
          <span className="brand-name">Protocolo Solar</span>
        </a>

        <div className="nav-pill" id="navPill">
          <div className="nav-hi" id="navHi" />
          <a href="#casas" data-sec="casas" className="active">
            <svg className="nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
            <span>Início</span>
          </a>
          <a href="#inside" data-sec="inside">
            <svg className="nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <span>Raio-X</span>
          </a>
          <a href="#colecao" data-sec="colecao">
            <svg className="nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>12 Casas</span>
          </a>
          <a href="#ciclo" data-sec="ciclo">
            <svg className="nav-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="3" />
              <path d="M2 10h20" />
            </svg>
            <span>Créditos</span>
          </a>
        </div>

        <div className="nav-actions">
          <select
            aria-label="Idioma"
            className="v2-lang-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
          >
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {user ? (
            <Link className="chip-btn" to="/v2/perfil" style={{ textDecoration: "none" }}>
              ✦ {credits} cr.
            </Link>
          ) : (
            <Link className="chip-btn" to="/v2/entrar" style={{ textDecoration: "none" }}>
              Entrar
            </Link>
          )}

          <button className="chip-btn chip-cta" id="navPastCta" type="button">
            Consulta Grátis
          </button>
        </div>
      </nav>

      {/* SECTION 1: HERO 3D ENVELOPES ARC */}
      <section id="casas" aria-label="Vitrine das 12 Casas Solares">
        <div className="reveal" id="revealLayer" />
        <div className="rings" id="rings" />
        <div className="star-layer" id="starLayer" aria-hidden="true" />

        {/* Subtle 1-line context eyebrow for cold ad traffic (never blocks 3D cards) */}
        <Link to="/v2/consulta-gratis" className="v2-hero-eyebrow">
          <span>✦ Onde passar seu aniversário muda o foco do seu ano ·</span>
          <strong>Testar o último grátis →</strong>
        </Link>

        <div className="arc-hit" id="arcHit" aria-label="Arraste para explorar os 12 Envelopes" />
        <div className="fallback-hero" id="fallbackHero">
          <img id="fallbackImg" alt="Envelope da Casa Solar" />
        </div>

        <div id="count" aria-hidden="true">01</div>

        <button id="autoBtn" type="button" aria-pressed="true" aria-label="Alternar rotação automática">
          <span className="auto-ring" id="autoIcon">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="1.5" width="2.8" height="9" rx="1" />
              <rect x="7.2" y="1.5" width="2.8" height="9" rx="1" />
            </svg>
          </span>
          <span className="auto-lbl">Autoplay</span>
        </button>

        <div className="hero-bottom">
          <div className="hero-controls-row" id="heroControls">
            <button className="circle-arrow" id="prevBtn" type="button" aria-label="Casa anterior">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </button>
            <button className="hero-trailer-pill" id="heroTrailerBtn" type="button">
              <span id="heroTrailerDot">↓</span>
              <span id="heroTrailerLbl">Ver Raio-X da Casa 01</span>
            </button>
            <button className="circle-arrow" id="nextBtn" type="button" aria-label="Próxima Casa">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
          <h1 id="title" aria-live="polite">Autonomia &amp; Novo Começo</h1>
          <p id="heroHook">Para tomar decisões por conta própria e resgatar a coragem.</p>
          <div className="house-dots" id="houseDots" aria-label="Ir direto para uma Casa" />
        </div>
      </section>

      {/* SECTION 2: PINNED INSIDE / 180° FLIP + SLIDING TICKET */}
      <section id="inside" aria-label="Como a Casa funciona na prática">
        <div className="pin">
          <div className="in-dark" id="inDark" />
          <div className="in-back-frame" id="inBackFrame">
            <div className="in-num" id="inNum">01</div>
            <div id="inBar" />
          </div>
        </div>
      </section>

      {/* Fixed overlay for Section 2 front typography & storm (above #gl canvas) */}
      <div id="inFront" aria-hidden="true">
        <div className="in-front-frame" id="inFrontFrame">
          <h2 className="in-head" id="inHead">
            AUTONOMIA,<br />SEM LICENÇA.
          </h2>
          <div className="in-cta-wrap">
            <button className="in-cta" id="inPrimaryBtn" type="button">02 · Próximo →</button>
          </div>
          <div className="in-steps" id="inSteps">
            <button className="step-btn active" data-step="0" type="button" title="01 · Para quem é">01</button>
            <button className="step-btn" data-step="1" type="button" title="02 · Quando escolher">02</button>
            <button className="step-btn" data-step="2" type="button" title="03 · Na prática">03</button>
            <button className="step-btn" data-step="3" type="button" title="04 · A Energia do Ano">04</button>
          </div>
          <div className="in-cap" id="inCap">
            <span className="in-cap-label">01 · Para quem é</span>Pessoas que viveram em função dos outros ou dizendo sim para tudo.
          </div>
        </div>
        <div className="storm-layer" id="stormLayer" />
      </div>

      {/* SECTION 3: COLEÇÃO DAS 12 CASAS */}
      <section id="colecao" aria-label="Coleção completa das 12 Casas Solares">
        <div className="sec-head">
          <div>
            <div className="sec-eyebrow">12 energias · 12 caminhos pro seu ano</div>
            <h2 className="sec-title">
              As 12 Casas<br />do Seu Ciclo
            </h2>
          </div>
          <p className="sec-caption">
            Cada Casa representa a área da vida que ganha força nos próximos 12 meses. A cidade que ativa cada uma depende do seu mapa natal individual.
          </p>
        </div>
        <div className="cards-grid" id="cardsGrid" />
      </section>

      {/* DEDICATED HIGH-CONTRAST FREE CONSULTATION BAND (Upgraded with React Bits GradientText!) */}
      <section id="freeBand" aria-label="Consulta Grátis do ciclo atual">
        <div className="free-band-wrap">
          <div className="free-band-left">
            <img className="free-globe" src="/earth-master.png" alt="Terra Orbital" />
            <div>
              <span className="free-kicker">✦ 100% Grátis · Resultado na hora</span>
              <h2 className="free-band-title">
                <GradientText
                  colors={["#FFF6D8", "#F5D993", "#E6A94C", "#FFD479"]}
                  animationSpeed={7}
                  variant="flow"
                  glow={0.28}
                >
                  Em qual Casa você está vivendo este ano?
                </GradientText>
              </h2>
              <p className="free-band-sub">
                Informe onde passou seu último aniversário e sinta na prática qual energia está ativa na sua vida hoje.
              </p>
            </div>
          </div>
          <button className="specular-btn" id="pastStripBtn" type="button">
            Fazer minha Consulta Grátis →
          </button>
        </div>
      </section>

      {/* SECTION 4: CRÉDITOS PROTOCOLO SOLAR (Wired to Real Mercado Pago /credits?pkg=single|3|full) */}
      <section id="ciclo" data-pkg="combo3" aria-label="Escolha seus créditos para o próximo aniversário">
        <div className="aura-blob b1" aria-hidden="true" />
        <div className="aura-blob b2" aria-hidden="true" />

        <div className="builder-wrap">
          <div className="plans-head">
            <div className="sec-eyebrow" style={{ color: "rgba(16,22,34,0.72)" }}>
              Acesso imediato · Pagamento único
            </div>
            <h2 className="builder-title">Escolha Seus Créditos</h2>
            <p className="builder-sub">
              Cada crédito libera 1 Casa ou 1 Cidade completa (todas as 8 áreas da vida abertas) + seu Guia personalizado.
            </p>
            <div className="picked-house-pill" id="pickedHousePill">
              <span className="picked-house-dot" id="pickedHouseDot" />
              <span id="pickedHouseText">Casa selecionada</span>
            </div>
          </div>

          <div className="tier-seg-wrap">
            <div className="tier-seg" id="tierSeg" role="tablist" aria-label="Escolha seus créditos">
              <div className="tier-thumb" id="tierThumb" />
              <button className="tier-seg-btn" data-pkg="single" data-idx="0" type="button" role="tab">1 Crédito</button>
              <button className="tier-seg-btn active" data-pkg="combo3" data-idx="1" type="button" role="tab">3 Créditos ★</button>
              <button className="tier-seg-btn" data-pkg="full12" data-idx="2" type="button" role="tab">Mapa 12</button>
            </div>
          </div>

          <div className="pricing-stage" id="pricingStage">
            <div className="morph-deck" id="morphDeck">
              <span className="morph-deck-badge" id="morphDeckBadge" />
            </div>

            <div className="tier-info">
              <div className="tier-meta-row">
                <span className="tier-credit-pill" id="tierCreditPill">3 CRÉDITOS · PARA COMPARAR 3 OPÇÕES</span>
                <span className="tier-save-pill" id="tierSavePill">Economize R$ 9,80</span>
              </div>
              <h3 className="tier-title" id="tierTitle">3 Créditos Solares</h3>
              <div className="odo-row">
                <div className="odo-price" aria-label="Preço do plano">
                  <span className="odo-prefix">R$</span>
                  <span className="odo-slot">
                    <span className="odo-strip" id="odoTens">
                      <span>1</span>
                      <span>4</span>
                      <span>9</span>
                    </span>
                  </span>
                  <span className="odo-slot">
                    <span className="odo-strip" id="odoOnes">
                      <span>9</span>
                      <span>9</span>
                      <span>9</span>
                    </span>
                  </span>
                  <span>,90</span>
                </div>
                <span className="odo-once">pagamento único</span>
              </div>
              <ul className="tier-bullets" id="tierBullets" />
              <button className="specular-btn tier-spec-cta" id="tierBuyBtn" type="button">
                Liberar agora →
              </button>
            </div>
          </div>

          <p className="compliance-note">
            Acesso digital imediato na tela · Pagamento único (sem assinatura) · Cálculo astronômico Swiss Ephemeris · Ferramenta cultural e informativa para planejamento de aniversário (18+), sem promessa determinística.
          </p>
        </div>
      </section>

      {/* COHESIVE HOUSE-COLORED MODAL */}
      <div className="drawer-backdrop" id="drawerBackdrop" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
        <div className="drawer" id="drawerCard">
          <div className="drawer-head">
            <div>
              <div className="drawer-eyebrow" id="drawerEyebrow">Casa 01 · Elemento Fogo</div>
              <h3 className="drawer-title" id="drawerTitle">Autonomia &amp; Novo Começo</h3>
              <p className="drawer-sub" id="drawerSub">A energia do Protagonismo, da Coragem e do Recomeço</p>
            </div>
            <button className="drawer-close" id="drawerClose" type="button" aria-label="Fechar detalhes">×</button>
          </div>
          <div className="drawer-media" id="drawerMedia" />
          <div className="drawer-pillars" id="drawerPillars" />
          <div className="drawer-note">
            <strong>Importante:</strong> nenhuma cidade pertence exclusivamente a esta Casa. Duas pessoas na mesma cidade no aniversário ativam Casas diferentes conforme o horário de nascimento.
          </div>
          <div className="drawer-actions">
            <button className="gold-btn" id="drawerPickBtn" type="button">Ver Planos com esta Casa →</button>
            <button className="drawer-secondary" id="drawerPastBtn" type="button">Consulta Grátis</button>
          </div>
        </div>
      </div>

      <V2Footer />

      {/* Hidden video elements for Three.js VideoTexture */}
      <video id="vid1" src="/v2-assets/casa-01.mp4" muted loop playsInline preload="metadata" crossOrigin="anonymous" style={{ display: "none" }} />
      <video id="vid2" src="/v2-assets/casa-02.mp4" muted loop playsInline preload="metadata" crossOrigin="anonymous" style={{ display: "none" }} />
    </div>
  );
}
