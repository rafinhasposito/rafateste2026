import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AFFINITY_MATRIX_V2, HOUSES_V2, LIFE_AREAS_V2, getHouseV2 } from "../data/housesV2";
import { getEnvelopeDataUrl } from "../components/envelopeCanvas";
import { V2TopNav, V2IosTabBar, V2Footer } from "../components/V2Chrome";
import { useSolarScrollReveal } from "../components/SolarMotion";
import DecryptedText from "../components/reactbits/DecryptedText";
import MagicBento, { type MagicBentoItem } from "../components/reactbits/MagicBento";
import "../v2.css";

interface CityLike {
  display_name?: string;
  city?: string;
  country?: string;
  continent?: string;
}

const MONTHS_SOLAR = [
  "Mês 01 · Virada do Ciclo (Plantio)",
  "Mês 02 · Organização de Recursos",
  "Mês 03 · Comunicação & Movimento",
  "Mês 04 · Base Emocional & Lar",
  "Mês 05 · Criatividade & Magnetismo",
  "Mês 06 · Rotina & Ajustes Práticos",
  "Mês 07 · Alianças & Contratos",
  "Mês 08 · Virada & Cortes Estratégicos",
  "Mês 09 · Expansão & Novos Ares",
  "Mês 10 · Colheita & Visibilidade",
  "Mês 11 · Rede & Oportunidades",
  "Mês 12 · Balanço & Preparação"
];

export default function ResultV2() {
  const { houseId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const numericHouse = Math.min(12, Math.max(1, Number(houseId) || 1));
  const house = getHouseV2(numericHouse);
  const envUrl = useMemo(() => getEnvelopeDataUrl(house), [house]);

  const routeState = (location.state || {}) as {
    consultationId?: string;
    userName?: string;
    targetYear?: string;
    chosenCity?: string;
    unlocked?: boolean;
    payload?: any;
  };

  const consultationId = searchParams.get("consultationId") || routeState.consultationId || "";
  const [dbRow, setDbRow] = useState<any>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string>("dinheiro");
  const [isMob, setIsMob] = useState(() => typeof window !== "undefined" && window.innerWidth < 820);
  const rootRef = useRef<HTMLDivElement>(null);
  useSolarScrollReveal(rootRef, [numericHouse]);

  useEffect(() => {
    document.title = `Resultado Casa ${house.code} — ${house.title} | Protocolo Solar`;
    const onResize = () => setIsMob(window.innerWidth < 820);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [house]);

  useEffect(() => {
    if (!consultationId || !user || routeState.payload) return;
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("consultations")
        .select("*")
        .eq("id", consultationId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (alive && data) setDbRow(data);
    })();
    return () => { alive = false; };
  }, [consultationId, user, routeState.payload]);

  const payload = routeState.payload || dbRow?.result || null;
  const userName = routeState.userName || dbRow?.name || sessionStorage.getItem("ps_natal_name") || "Viajante";
  const targetYear = routeState.targetYear || dbRow?.year || String(new Date().getFullYear() + 1);
  const unlockedList: number[] = payload?.unlocked_houses_list || (routeState.unlocked ? [numericHouse] : []);
  const isUnlocked = Boolean(routeState.unlocked || payload?.full_map_unlocked || unlockedList.includes(numericHouse));

  const houseEntry = payload?.results?.[String(numericHouse)] || null;
  const chosenCity: string | null = routeState.chosenCity || payload?.chosen_city || houseEntry?.city?.display_name || null;

  const recommendedCities = useMemo(() => {
    const out: { label: string; city: string; country: string }[] = [];
    const pushCity = (label: string, raw: CityLike | CityLike[] | null | undefined) => {
      if (!raw) return;
      const list = Array.isArray(raw) ? raw : [raw];
      for (const c of list.slice(0, 2)) {
        const name = c?.city || c?.display_name;
        if (!name) continue;
        if (out.some((x) => x.city === name)) continue;
        out.push({ label, city: name, country: c?.country || c?.continent || "" });
      }
    };
    if (houseEntry?.city) pushCity("Destino Principal", houseEntry.city);
    if (houseEntry?.options) {
      pushCity("Perto / Brasil", houseEntry.options.nacional);
      pushCity("Acessível", houseEntry.options.acessivel);
      pushCity("Internacional", houseEntry.options.highticket);
    }
    return out;
  }, [houseEntry]);

  const scores = AFFINITY_MATRIX_V2[house.id] || AFFINITY_MATRIX_V2[1];
  const selectedArea = LIFE_AREAS_V2.find((a) => a.id === selectedAreaId) || LIFE_AREAS_V2[0];
  const selectedAreaIdx = LIFE_AREAS_V2.findIndex((a) => a.id === selectedArea.id);
  const selectedScore = scores[selectedAreaIdx] ?? 86;

  const bentoItems: MagicBentoItem[] = useMemo(
    () =>
      LIFE_AREAS_V2.map((area, idx) => {
        const sc = scores[idx] ?? 84;
        const active = area.id === selectedAreaId;
        return {
          id: area.id,
          label: `${area.icon} ${sc}% SINTONIA`,
          title: area.label,
          description: active ? "Selecionado · veja os 3 focos abaixo" : "Toque para abrir Essência, Método e Fase Atual",
          onClick: () => setSelectedAreaId(area.id)
        };
      }),
    [scores, selectedAreaId]
  );

  return (
    <div className="v2-root" ref={rootRef}>
      <V2TopNav activeTab="consult" backTo={{ label: "← Nova Consulta", to: "/consultar" }} />

      <main
        style={{
          background: `linear-gradient(155deg, ${house.bg1} 0%, ${house.bg2} 100%)`,
          padding: isMob ? "78px 20px 64px" : "96px min(4vw, 56px) 84px"
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          {/* BOARDING PASS RESULT HERO */}
          <section
            className="solar-hero-in"
            style={{
              background: "rgba(255,255,255,0.94)",
              border: "1.5px solid rgba(255,255,255,0.98)",
              borderRadius: isMob ? 24 : 30,
              padding: isMob ? "22px 18px" : "30px 32px",
              boxShadow: "0 30px 72px -24px rgba(16,22,34,0.22)",
              display: "grid",
              gridTemplateColumns: isMob ? "1fr" : "1.15fr 0.85fr",
              gap: 24,
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: house.env, marginBottom: 8 }}>
                <DecryptedText
                  text={`DOSSIÊ SOLAR ${targetYear} · CASA ${house.code} · ${userName.toUpperCase()}`}
                  animateOn="view"
                  effect="flip"
                  sequential
                  speed={32}
                  scrambleColor="#C9A227"
                />
              </div>

              <h1 className="v2-serif" style={{ fontSize: "clamp(30px, 4.2vw, 48px)", lineHeight: 1.03, color: house.envDark, marginBottom: 12 }}>
                {house.title}
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.54, color: "#384357", marginBottom: 18 }}>
                {house.copy}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                <img src={envUrl} alt={`Envelope Casa ${house.code}`} style={{ height: 64, width: "auto" }} />
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(16,22,34,0.56)" }}>
                    {chosenCity ? "Destino Analisado" : "Status do Dossiê"}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: house.envDark }}>
                    {chosenCity || (isUnlocked ? "Liberado no seu mapa" : "Prévia · Cidades bloqueadas")}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 20, overflow: "hidden", background: house.envDark }}>
              <video
                src={house.video}
                poster={house.poster}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </section>

          {/* CIDADES RECOMENDADAS (REAL DATA WHEN UNLOCKED, LOCKED GATE OTHERWISE) */}
          <section
            className="solar-reveal"
            style={{
              background: "#0B101B",
              color: "#FFF8E6",
              borderRadius: isMob ? 24 : 30,
              padding: isMob ? "24px 18px" : "30px 32px",
              boxShadow: "0 28px 64px -20px rgba(11,16,27,0.42)"
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#F5D993", marginBottom: 8 }}>
              ✦ Cidades Que Ativam a Casa {house.code} em {targetYear}
            </div>

            {isUnlocked && recommendedCities.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "repeat(3, 1fr)", gap: 14, marginTop: 16 }}>
                {recommendedCities.map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 18,
                      borderRadius: 20,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(245,217,147,0.22)"
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#F5D993", marginBottom: 6 }}>
                      {c.label}
                    </div>
                    <div className="v2-serif" style={{ fontSize: 24, lineHeight: 1.1, marginBottom: 4 }}>
                      {c.city}
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,248,230,0.68)" }}>{c.country}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 10 }}>
                <p style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(255,248,230,0.78)", maxWidth: "56ch" }}>
                  As cidades exatas (perto de casa, Brasil e internacional) dependem da sua hora e local de nascimento. Libere 1 crédito para revelar os destinos exatos da Casa {house.code} no seu mapa.
                </p>
                <button
                  type="button"
                  className="v2-specular-btn v2-specular-gold"
                  onClick={() => navigate(`/creditos?pkg=single&returnTo=${encodeURIComponent(`/consultar?house=${house.id}`)}`)}
                >
                  Liberar minhas cidades →
                </button>
              </div>
            )}
          </section>

          {/* 8 ÁREAS DA VIDA COM REACT BITS MAGIC BENTO */}
          <section
            className="solar-reveal"
            style={{
              background: "rgba(255,255,255,0.94)",
              borderRadius: isMob ? 24 : 30,
              padding: isMob ? "24px 18px" : "32px 32px",
              boxShadow: "0 24px 60px -24px rgba(16,22,34,0.16)"
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: house.env, marginBottom: 6 }}>
                8 Áreas da Vida · Leitura Completa
              </div>
              <h2 className="v2-serif" style={{ fontSize: "clamp(26px, 3.4vw, 38px)", color: house.envDark }}>
                Como a Casa {house.code} Atua em Cada Área
              </h2>
            </div>

            <div style={{ background: "#0B101B", borderRadius: 22, padding: 14, marginBottom: 20 }}>
              <MagicBento items={bentoItems} columns={4} rowHeight={148} theme="dark" glowColor="#F5D993" enableTilt={false} />
            </div>

            <div
              style={{
                borderRadius: 22,
                padding: isMob ? 18 : 24,
                background: "#FAF6F0",
                border: "1.5px solid rgba(16,22,34,0.08)"
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
                <div className="v2-serif" style={{ fontSize: 24, color: house.envDark }}>
                  {selectedArea.icon} {selectedArea.label}
                </div>
                <span style={{ padding: "5px 12px", borderRadius: 999, background: house.envDark, color: "#F5D993", fontSize: 11.5, fontWeight: 800 }}>
                  {selectedScore}% de sintonia
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: house.env, marginBottom: 6 }}>
                    01 · Sua Essência
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: "#384357" }}>{selectedArea.essencia}</p>
                </div>
                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: house.env, marginBottom: 6 }}>
                    02 · Seu Método
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: "#384357" }}>{selectedArea.metodo}</p>
                </div>
                <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 16 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: house.env, marginBottom: 6 }}>
                    03 · Fase Atual
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.5, color: "#384357" }}>{selectedArea.fase}</p>
                </div>
              </div>
            </div>
          </section>

          {/* PROTOCOLO DAS PRIMEIRAS 24H + CALENDÁRIO 12 MESES */}
          <section className="solar-reveal" style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "0.95fr 1.05fr", gap: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.94)", borderRadius: 24, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: house.env, marginBottom: 8 }}>
                ⏱ Primeiras 24 Horas do Ciclo
              </div>
              <h3 className="v2-serif" style={{ fontSize: 26, color: house.envDark, marginBottom: 12 }}>
                Como Ancorar a Energia no Aniversário
              </h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, paddingLeft: 18, color: "#384357", fontSize: 14.5, lineHeight: 1.5 }}>
                <li>Chegue à cidade escolhida antes do minuto exato do seu Retorno Solar e permaneça ao menos 24h em solo firme.</li>
                <li>Reserve 20 minutos de silêncio para escrever 3 metas alinhadas ao tema de <strong>{house.title}</strong>.</li>
                <li>Faça uma primeira ação simbólica concreta ligada a esta Casa nas primeiras 24h.</li>
              </ul>
            </div>

            <div style={{ background: "rgba(255,255,255,0.94)", borderRadius: 24, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: house.env, marginBottom: 8 }}>
                📅 Mapa dos 12 Meses
              </div>
              <h3 className="v2-serif" style={{ fontSize: 26, color: house.envDark, marginBottom: 12 }}>
                Ritmo do Seu Ano Solar
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "1fr 1fr", gap: 8 }}>
                {MONTHS_SOLAR.map((m, i) => (
                  <div key={i} style={{ padding: "8px 12px", borderRadius: 12, background: "#FAF6F0", fontSize: 12.5, fontWeight: 700, color: "#101622" }}>
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* EXPLORAR OUTRAS CASAS */}
          <section style={{ textAlign: "center" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {HOUSES_V2.map((h) => (
                <Link
                  key={h.id}
                  to={`/resultado/${h.id}${consultationId ? `?consultationId=${consultationId}` : ""}`}
                  className="v2-pill-btn"
                  style={{
                    background: h.id === house.id ? "#101622" : "rgba(255,255,255,0.88)",
                    color: h.id === house.id ? "#FFF8E6" : "#101622"
                  }}
                >
                  Casa {h.code}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <V2Footer />
      <V2IosTabBar activeTab="consult" />
    </div>
  );
}
