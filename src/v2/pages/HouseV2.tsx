import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AFFINITY_MATRIX_V2, LIFE_AREAS_V2, getHouseV2 } from "../data/housesV2";
import { getEnvelopeDataUrl } from "../components/envelopeCanvas";
import { V2TopNav, V2IosTabBar } from "../components/V2Chrome";
import { CreditsStageV2 } from "../components/CreditsStageV2";
import "../v2.css";

export default function HouseV2() {
  const { houseId } = useParams<{ houseId: string }>();
  const h = getHouseV2(Number(houseId || 1));
  const envUrl = useMemo(() => getEnvelopeDataUrl(h), [h]);

  const [checked, setChecked] = useState<boolean[]>([true, false, false]);
  const [selectedFocus, setSelectedFocus] = useState(0);
  const [isMob, setIsMob] = useState(() => typeof window !== "undefined" && window.innerWidth < 820);

  useEffect(() => {
    setChecked([true, false, false]);
    setSelectedFocus(0);
    window.scrollTo({ top: 0 });
    document.title = `Casa ${h.code} · ${h.title} — Protocolo Solar`;
  }, [h.id, h.code, h.title]);

  useEffect(() => {
    const onResize = () => setIsMob(window.innerWidth < 820);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const count = checked.filter(Boolean).length;
  const feelStates = [
    { pct: 0, msg: `Toque nos sinais acima para medir sua sintonia com a Casa ${h.code}.` },
    { pct: 38, msg: `1 sinal marcado — a Casa ${h.code} já começou a falar com você.` },
    { pct: 74, msg: `2 sinais marcados — forte alinhamento com a energia da Casa ${h.code}.` },
    { pct: 98, msg: `98% de sintonia — a Casa ${h.code} é exatamente a virada pro seu próximo ano.` }
  ];
  const feel = feelStates[count];
  const scales = isMob ? [0.84, 1.0, 1.15, 1.28] : [0.84, 1.04, 1.24, 1.44];
  const lifts = [0, -10, -22, -34];
  const rots = [-6, -2, 3, 7];

  const sortedFocos = useMemo(() => {
    const scores = AFFINITY_MATRIX_V2[h.id] || AFFINITY_MATRIX_V2[1];
    return LIFE_AREAS_V2.map((area) => ({ ...area, score: scores[area.id] ?? 70 })).sort((a, b) => b.score - a.score);
  }, [h.id]);

  const activeFoco = sortedFocos[selectedFocus] || sortedFocos[0];
  const prevId = h.id === 1 ? 12 : h.id - 1;
  const nextId = h.id === 12 ? 1 : h.id + 1;

  return (
    <div className="v2-root">
      <V2TopNav activeTab="houses" backTo={{ label: "← 12 Casas", to: "/#colecao" }} />

      {/* ATO 1: BOARDING PASS HERO COM VÍDEO REAL DA CASA */}
      <header
        style={{
          padding: isMob ? "76px 20px 36px" : "96px min(4vw, 56px) 64px",
          background: `linear-gradient(155deg, ${h.bg1} 0%, ${h.bg2} 100%)`
        }}
      >
        <div className="v2-bp-card">
          <div className="v2-bp-left">
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 18 }}>
                <span style={{ padding: "6px 13px", borderRadius: 999, background: h.env, color: "#FFF8E6", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em" }}>
                  CASA {h.code} · {h.cover}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.56 }}>
                  PS-{h.code} · 365D
                </span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: h.envDark, opacity: 0.72, marginBottom: 8 }}>
                A ENERGIA DA CASA {h.code}
              </div>
              <h1 className="v2-serif" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", lineHeight: 1.03, color: h.envDark, marginBottom: 14 }}>
                {h.title}
              </h1>
              <p style={{ fontSize: 15.5, lineHeight: 1.5, color: "rgba(16,22,34,0.8)", marginBottom: 24 }}>
                {h.oneLiner}
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <a className="v2-specular-btn" style={{ height: 50, padding: "0 24px", flex: isMob ? "1 1 100%" : undefined }} href="#planos">
                Ativar Casa {h.code} ↓
              </a>
              <Link className="v2-pill-btn" style={{ height: 50, padding: "0 20px", display: isMob ? "none" : "inline-flex" }} to="/consulta-gratis">
                Consulta Grátis
              </Link>
            </div>
          </div>

          <div className="v2-bp-right">
            <div style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: isMob ? 16 : 20, overflow: "hidden", background: h.envDark, boxShadow: "0 22px 44px -14px rgba(16,22,34,0.24)" }}>
              <video
                key={h.id}
                src={h.video}
                poster={h.poster}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ATO 2: TERMÔMETRO INTERATIVO "VOCÊ SENTE ISSO?" COM ENVELOPE SALTANDO PRA FORA */}
      <section id="sinais" style={{ padding: isMob ? "56px 20px" : "80px min(4vw, 56px)", background: "#F4EAE0", scrollMarginTop: 60 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: h.envDark, opacity: 0.72, marginBottom: 8 }}>
            Toque nos sinais que falam do seu momento
          </div>
          <h2 className="v2-serif" style={{ fontSize: "clamp(28px, 3.8vw, 48px)", lineHeight: 1.02, marginBottom: 24 }}>
            Você Sente Isso?
          </h2>

          <div
            className="v2-feel-shell"
            style={{ background: `linear-gradient(155deg, ${h.bg1} 0%, ${h.bg2} 100%)` }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {h.signals.map((sig, idx) => {
                const on = checked[idx];
                return (
                  <button
                    key={sig.tag}
                    type="button"
                    onClick={() => setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 18px",
                      borderRadius: 20,
                      border: `1.5px solid ${on ? h.env : "rgba(255,255,255,0.92)"}`,
                      background: on ? h.env : "rgba(255,255,255,0.92)",
                      color: on ? "#FFFFFF" : "#101622",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 220ms cubic-bezier(0.22, 1, 0.36, 1)"
                    }}
                  >
                    <img
                      src={sig.avatar}
                      alt=""
                      style={{ width: 46, height: 46, borderRadius: "50%", background: "#FAF4EC", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: "block", fontSize: 13.5, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 2 }}>
                        {sig.tag}
                      </strong>
                      <span style={{ fontSize: 13.5, opacity: 0.85, lineHeight: 1.32, display: "block" }}>{sig.line}</span>
                    </div>
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 900,
                        background: on ? "#F5D993" : "rgba(16,22,34,0.06)",
                        color: on ? h.envDark : "#101622",
                        flexShrink: 0
                      }}
                    >
                      {on ? "✓" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                borderRadius: 26,
                padding: isMob ? "24px 20px" : "30px 26px 26px",
                background: `linear-gradient(155deg, ${h.env} 0%, ${h.envDark} 100%)`,
                color: "#FFF8E6",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 18,
                minHeight: isMob ? 236 : 310,
                position: "relative",
                overflow: "visible",
                marginTop: isMob ? 16 : 0,
                boxShadow: "0 24px 52px -18px rgba(16,22,34,0.36)"
              }}
            >
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.16em", opacity: 0.78, marginBottom: 4 }}>
                  SINTONIA COM A CASA {h.code}
                </div>
                <div className="v2-serif" style={{ fontSize: isMob ? 50 : 64, lineHeight: 1, color: "#F5D993", fontVariantNumeric: "tabular-nums" }}>
                  {feel.pct}%
                </div>
                <img
                  src={envUrl}
                  alt={`Envelope Casa ${h.code}`}
                  style={{
                    position: "absolute",
                    right: isMob ? -2 : -4,
                    top: isMob ? -22 : -28,
                    height: isMob ? 118 : 154,
                    width: "auto",
                    zIndex: 6,
                    transformOrigin: "center bottom",
                    transform: `translateY(${lifts[count]}px) scale(${scales[count]}) rotate(${rots[count]}deg)`,
                    filter: count === 3 ? "drop-shadow(0 28px 36px rgba(245,217,147,0.45))" : "drop-shadow(0 22px 28px rgba(0,0,0,0.44))",
                    transition: "transform 460ms cubic-bezier(0.22, 1, 0.36, 1), filter 380ms ease"
                  }}
                />
              </div>
              <div>
                <div style={{ height: 7, borderRadius: 999, background: "rgba(255,255,255,0.16)", overflow: "hidden", marginBottom: 14 }}>
                  <div style={{ height: "100%", width: `${feel.pct}%`, background: "#F5D993", borderRadius: 999, transition: "width 420ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: "rgba(255,248,230,0.92)", maxWidth: "28ch" }}>
                  {feel.msg}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATO 3: OS 8 FOCOS DE VIDA INTERATIVOS (PRESERVANDO 01. SUA ESSÊNCIA / 02. SEU MÉTODO / 03. FASE ATUAL) */}
      <section id="focos" style={{ padding: isMob ? "56px 20px" : "80px min(4vw, 56px)", background: "#FFFFFF", scrollMarginTop: 60 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: h.envDark, opacity: 0.72, marginBottom: 8 }}>
            Toque em cada área da sua vida
          </div>
          <h2 className="v2-serif" style={{ fontSize: "clamp(28px, 3.8vw, 48px)", lineHeight: 1.02, marginBottom: 24 }}>
            Os 8 Focos Desta Casa
          </h2>

          <div className="v2-focos-grid">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {sortedFocos.map((f, idx) => {
                const on = idx === selectedFocus;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFocus(idx)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 18,
                      border: `1.5px solid ${on ? h.env : "rgba(16,22,34,0.08)"}`,
                      background: on ? h.env : "#FAF6F0",
                      color: on ? "#FFFFFF" : "#101622",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      transition: "all 200ms ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>{f.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: on ? "#F5D993" : h.envDark }}>{f.score}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 999, background: on ? "rgba(255,255,255,0.2)" : "rgba(16,22,34,0.1)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${f.score}%`, background: on ? "#F5D993" : h.env, borderRadius: 999 }} />
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                borderRadius: 26,
                padding: isMob ? "24px 20px" : "30px 28px",
                background: `linear-gradient(155deg, ${h.bg1} 0%, ${h.bg2} 100%)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 18
              }}
            >
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.16em", color: h.envDark, opacity: 0.75, marginBottom: 8 }}>
                  CASA {h.code} · AFINIDADE COM ESTE FOCO
                </div>
                <div className="v2-serif" style={{ fontSize: isMob ? 50 : 62, lineHeight: 1, color: h.envDark, marginBottom: 8 }}>
                  {activeFoco.score}%
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: h.envDark, marginBottom: 10 }}>{activeFoco.label}</h3>
                <p style={{ fontSize: 15.5, lineHeight: 1.5, color: "rgba(16,22,34,0.84)" }}>{activeFoco.text}</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 14, borderTop: "1px solid rgba(16,22,34,0.12)" }}>
                {["01. Sua Essência", "02. Seu Método", "03. Fase Atual"].map((pillar) => (
                  <span key={pillar} style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.84)", fontSize: 11.5, fontWeight: 800, color: h.envDark }}>
                    {pillar}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATO 4: CRÉDITOS + NAVEGAÇÃO ENTRE CASAS */}
      <CreditsStageV2 id="planos" focusHouseId={h.id} initialPkg="3" />

      <div style={{ background: "#F4EAE0", padding: isMob ? "18px 20px 104px" : "22px min(4vw, 56px) 44px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <Link className="v2-pill-btn" to={`/casas/${prevId}`}>← Casa {String(prevId).padStart(2, "0")}</Link>
          <Link className="v2-pill-btn" to="/#colecao">Todas as 12</Link>
          <Link className="v2-pill-btn" to={`/casas/${nextId}`}>Casa {String(nextId).padStart(2, "0")} →</Link>
        </div>
      </div>

      <V2IosTabBar activeTab="houses" />

      <style>{`
        .v2-bp-card {
          max-width: 1120px;
          margin: 0 auto;
          border-radius: 30px;
          background: rgba(255,255,255,0.92);
          border: 1.5px solid rgba(255,255,255,0.98);
          box-shadow: 0 32px 72px -24px rgba(16,22,34,0.2);
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          overflow: hidden;
        }
        .v2-bp-left {
          padding: 34px 32px;
          border-right: 2px dashed rgba(16,22,34,0.12);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .v2-bp-right {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.36);
        }
        .v2-feel-shell {
          border-radius: 30px;
          padding: 30px;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 28px;
          align-items: center;
          box-shadow: 0 28px 64px -22px rgba(16,22,34,0.16);
        }
        .v2-focos-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 28px;
          align-items: stretch;
        }
        @media (max-width: 960px) {
          .v2-bp-card, .v2-feel-shell, .v2-focos-grid {
            grid-template-columns: 1fr;
          }
          .v2-bp-right { order: -1; padding: 14px; border-bottom: 2px dashed rgba(16,22,34,0.14); }
          .v2-bp-left { border-right: 0; padding: 20px; }
          .v2-feel-shell { padding: 20px; gap: 36px; border-radius: 26px; }
          .v2-focos-grid { gap: 18px; }
        }
      `}</style>
    </div>
  );
}
