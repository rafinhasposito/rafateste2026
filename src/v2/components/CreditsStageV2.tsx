import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { HOUSES_V2, V2_UI, getHouseV2 } from "../data/housesV2";
import { getEnvelopeDataUrl } from "./envelopeCanvas";

type PkgKey = "single" | "3" | "full";

interface CreditsStageV2Props {
  id?: string;
  focusHouseId?: number;
  initialPkg?: PkgKey;
}

export function CreditsStageV2({ id = "creditos", focusHouseId = 1, initialPkg = "3" }: CreditsStageV2Props) {
  const { locale } = useI18n();
  const ui = V2_UI[locale] || V2_UI.pt;
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<PkgKey>(initialPkg);
  const [isCompact] = useState(() => typeof window !== "undefined" && window.innerWidth < 820);

  const heroHouse = getHouseV2(focusHouseId);
  const heroIdx = heroHouse.id - 1;
  const comboIds = [(heroIdx + 11) % 12, heroIdx, (heroIdx + 1) % 12];

  const envUrls = useMemo(() => HOUSES_V2.map((h) => getEnvelopeDataUrl(h)), []);

  const tierMap: Record<PkgKey, {
    idx: number;
    pill: string;
    badge: string;
    title: string;
    bullets: string[];
    cta: string;
  }> = {
    single: {
      idx: 0,
      pill: "1 CRÉDITO · PRIMEIRO PASSO",
      badge: "Acesso imediato",
      title: "1 Crédito Solar",
      bullets: [
        `Libera 1 Casa (ex.: Casa ${heroHouse.code}) ou 1 Cidade completa`,
        "Inclui todas as 8 áreas da vida abertas + Guia personalizado (12 meses + 24h)"
      ],
      cta: ui.ctaUnlock
    },
    "3": {
      idx: 1,
      pill: "3 CRÉDITOS · PARA COMPARAR 3 OPÇÕES",
      badge: "Economize R$ 9,80",
      title: "3 Créditos Solares",
      bullets: [
        "Compare até 3 Casas ou 3 Cidades lado a lado antes de decidir a viagem",
        "Todas as 8 áreas da vida abertas em cada consulta + Guia completo"
      ],
      cta: ui.ctaUnlock
    },
    full: {
      idx: 2,
      pill: "12 CRÉDITOS · MAPA COMPLETO",
      badge: "Todas as 12 Casas",
      title: "Mapa Completo · 12 Casas",
      bullets: [
        "Libera todas as 12 Casas do seu próximo aniversário com as 8 áreas abertas",
        "Explore destinos perto de casa (300 km), no Brasil e no mundo"
      ],
      cta: ui.ctaUnlockAll
    }
  };

  const t = tierMap[pkg];

  const handleCheckout = () => {
    // Preserva UTMs atuais ao ir direto para o checkout real /credits?pkg=...
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("pkg", pkg);
    navigate(`/credits?${currentParams.toString()}`);
  };

  return (
    <section id={id} className="v2-credits-sec" data-pkg={pkg}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.72, marginBottom: 8 }}>
            {ui.creditsEyebrow}
          </div>
          <h2 className="v2-serif" style={{ fontSize: "clamp(30px, 4.2vw, 52px)", lineHeight: 1.02, marginBottom: 10 }}>
            {ui.creditsTitle}
          </h2>
          <p style={{ fontSize: 15, color: "rgba(16, 22, 34, 0.76)", maxWidth: "56ch", margin: "0 auto" }}>
            {ui.creditsRule}
          </p>
        </div>

        <div className="v2-tier-seg" role="tablist" aria-label="Escolha o pacote de créditos">
          <div className="v2-tier-thumb" style={{ transform: `translateX(${t.idx * 100}%)` }} />
          <button className={`v2-tier-btn${pkg === "single" ? " active" : ""}`} type="button" role="tab" aria-selected={pkg === "single"} onClick={() => setPkg("single")}>
            {ui.tab1}
          </button>
          <button className={`v2-tier-btn${pkg === "3" ? " active" : ""}`} type="button" role="tab" aria-selected={pkg === "3"} onClick={() => setPkg("3")}>
            {ui.tab3}
          </button>
          <button className={`v2-tier-btn${pkg === "full" ? " active" : ""}`} type="button" role="tab" aria-selected={pkg === "full"} onClick={() => setPkg("full")}>
            {ui.tab12}
          </button>
        </div>

        <div className="v2-pricing-card">
          <div className="v2-morph-deck" aria-hidden="true">
            {HOUSES_V2.map((h, i) => {
              let opacity = 0;
              let zIndex = 1;
              let transform = "scale(0.7)";
              let stagger = "0ms";

              if (pkg === "single") {
                const isH = i === heroIdx;
                opacity = isH ? 1 : 0;
                zIndex = isH ? 15 : 1;
                transform = isH ? `translate3d(0,0,0) scale(${isCompact ? 1.06 : 1.12}) rotate(-3deg)` : "scale(0.7)";
              } else if (pkg === "3") {
                const slot = comboIds.indexOf(i);
                if (slot !== -1) {
                  opacity = 1;
                  zIndex = slot === 1 ? 16 : 10 + slot;
                  stagger = `${slot * 45}ms`;
                  const dx = (slot - 1) * (isCompact ? 54 : 84);
                  const dy = slot === 1 ? -10 : 8;
                  const sc = slot === 1 ? 1.06 : 0.94;
                  transform = `translate3d(${dx}px,${dy}px,0) scale(${sc}) rotate(${(slot - 1) * 14}deg)`;
                }
              } else {
                const ang = -28 + i * (56 / 11);
                opacity = 1;
                zIndex = 10 + i;
                stagger = `${i * 18}ms`;
                const dx = ((i - 5.5) * (isCompact ? 12 : 19)).toFixed(1);
                const dy = (Math.abs(i - 5.5) * 2.4 - 6).toFixed(1);
                transform = `translate3d(${dx}px,${dy}px,0) scale(${isCompact ? 0.82 : 0.9}) rotate(${ang.toFixed(1)}deg)`;
              }

              return (
                <img
                  key={h.id}
                  src={envUrls[i]}
                  alt={`Casa ${h.code}`}
                  className="v2-morph-card"
                  style={{ opacity, zIndex, transform, ["--stagger" as string]: stagger }}
                />
              );
            })}
          </div>

          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              <span style={{ padding: "5px 12px", borderRadius: 999, background: "#101622", color: "#FFF8E6", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em" }}>
                {t.pill}
              </span>
              <span style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(16,22,34,0.08)", color: "#101622", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {t.badge}
              </span>
            </div>

            <h3 style={{ fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 900, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
              {t.title}
            </h3>

            <div className="v2-odo-price">
              <span style={{ fontSize: 22, fontWeight: 800, opacity: 0.72 }}>R$</span>
              <span className="v2-odo-win">
                <span className="v2-odo-col" style={{ transform: `translateY(-${((t.idx * 100) / 3).toFixed(2)}%)` }}>
                  <span>1</span>
                  <span>4</span>
                  <span>9</span>
                </span>
              </span>
              <span className="v2-odo-win">
                <span className="v2-odo-col" style={{ transform: `translateY(-${((t.idx * 100) / 3).toFixed(2)}%)` }}>
                  <span>9</span>
                  <span>9</span>
                  <span>9</span>
                </span>
              </span>
              <span style={{ fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 900, letterSpacing: "-0.04em" }}>,90</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(16,22,34,0.62)", marginLeft: 4 }}>pagamento único</span>
            </div>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
              {t.bullets.map((b, idx) => (
                <li key={idx} style={{ fontSize: 14.5, lineHeight: 1.45, color: "rgba(16,22,34,0.82)", display: "flex", gap: 8 }}>
                  <span style={{ color: "#101622", fontWeight: 900 }}>✦</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <button className="v2-specular-btn" style={{ width: "100%" }} type="button" onClick={handleCheckout}>
              {t.cta}
            </button>
          </div>
        </div>

        <p style={{ marginTop: 22, textAlign: "center", fontSize: 12, color: "rgba(16,22,34,0.62)", maxWidth: "74ch", marginInline: "auto", lineHeight: 1.5 }}>
          {ui.compliance}
        </p>
      </div>
    </section>
  );
}
