import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import { API_URL, getCurrentSolarYear, getNextBirthdayYear, normalizeBirthTime } from "@/lib/astro";
import { resolveSearchTerm } from "@/lib/cityAliases";
import { prewarmSolarApi } from "@/lib/pastAuditClient";
import { useI18n } from "@/lib/i18n";
import { V2_UI, getHouseV2, type HouseV2 } from "../data/housesV2";
import { Lanyard3D } from "../components/Lanyard3D";
import { V2TopNav, V2IosTabBar } from "../components/V2Chrome";
import DecryptedText from "../components/reactbits/DecryptedText";
import "../v2.css";

const SIGNS: [string, number, number][] = [
  ["Capricórnio", 1, 19], ["Aquário", 2, 18], ["Peixes", 3, 20], ["Áries", 4, 19],
  ["Touro", 5, 20], ["Gêmeos", 6, 20], ["Câncer", 7, 22], ["Leão", 8, 22],
  ["Virgem", 9, 22], ["Libra", 10, 22], ["Escorpião", 11, 21], ["Sagitário", 12, 21], ["Capricórnio", 12, 31]
];

function getSolarSign(isoDate: string): string {
  if (!isoDate || !isoDate.includes("-")) return "";
  const [, mm, dd] = isoDate.split("-").map(Number);
  for (const [name, m, d] of SIGNS) {
    if (mm < m || (mm === m && dd <= d)) return name;
  }
  return "Capricórnio";
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number, maxLines = 2) {
  const words = String(text).split(/\s+/);
  let line = "";
  const lines: string[] = [];
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((ln, i) => ctx.fillText(ln, x, y + i * lineH));
}

function makeStrapCanvas() {
  const c = document.createElement("canvas");
  c.width = 768; c.height = 192;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#10141F";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "rgba(245, 217, 147, 0.16)";
  ctx.fillRect(0, 14, c.width, 3);
  ctx.fillRect(0, c.height - 17, c.width, 3);
  ctx.fillStyle = "#F5D993";
  ctx.font = "700 34px 'DM Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦   PROTOCOLO SOLAR   ✦", c.width / 2, c.height / 2 + 2);
  return c;
}

function makeFrontBadge(h: HouseV2, sign: string, name: string, pastYear: string, nextYear: string, city: string) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 1440;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 1024, 1440);
  grad.addColorStop(0, h.env);
  grad.addColorStop(1, h.envDark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1440);

  const rad = ctx.createRadialGradient(512, 540, 40, 512, 540, 520);
  rad.addColorStop(0, "rgba(245, 217, 147, 0.22)");
  rad.addColorStop(1, "rgba(245, 217, 147, 0)");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 1024, 1440);

  ctx.strokeStyle = "rgba(245, 217, 147, 0.34)";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(48, 175, 928, 1212, 42); ctx.stroke();

  ctx.fillStyle = "#F5D993";
  ctx.font = "700 28px 'DM Sans', sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("PASSAPORTE SOLAR", 96, 250);
  ctx.textAlign = "right";
  ctx.fillText(`SOL EM ${sign.toUpperCase()}`, 928, 250);

  ctx.strokeStyle = "rgba(245, 217, 147, 0.28)";
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.ellipse(512, 595, 260, 74, -0.18, 0, Math.PI * 2); ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(245, 231, 195, 0.85)";
  ctx.font = "400 44px 'Marcellus', Georgia, serif";
  ctx.fillText("C A S A", 512, 470);

  ctx.fillStyle = "#FFF4D1";
  ctx.font = "400 320px 'Marcellus', Georgia, serif";
  ctx.fillText(String(h.id), 512, 748);

  ctx.fillStyle = "#F5D993";
  ctx.font = "800 34px 'DM Sans', sans-serif";
  ctx.fillText(`—  ${h.cover}  —`, 512, 845);

  ctx.save();
  ctx.setLineDash([12, 12]);
  ctx.strokeStyle = "rgba(255, 248, 230, 0.28)";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(96, 945); ctx.lineTo(928, 945); ctx.stroke();
  ctx.restore();

  ctx.textAlign = "left";
  ctx.fillStyle = "rgba(255, 248, 230, 0.6)";
  ctx.font = "700 24px 'DM Sans', sans-serif";
  ctx.fillText("VIAJANTE", 96, 1018);
  ctx.fillText("CICLO ATIVO", 560, 1018);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 44px 'DM Sans', sans-serif";
  ctx.fillText(name.slice(0, 16), 96, 1076);
  ctx.fillText(`${pastYear} → ${nextYear}`, 560, 1076);

  ctx.fillStyle = "rgba(255, 248, 230, 0.6)";
  ctx.font = "700 24px 'DM Sans', sans-serif";
  ctx.fillText("CIDADE DO ANIVERSÁRIO", 96, 1172);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 38px 'DM Sans', sans-serif";
  wrapText(ctx, city, 96, 1228, 832, 48, 2);
  return c;
}

function makeLockedBackBadge(h: HouseV2, nextYear: string) {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 1440;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 1024, 1440);
  grad.addColorStop(0, "#101624");
  grad.addColorStop(1, "#070B13");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1440);

  ctx.strokeStyle = "rgba(245, 217, 147, 0.36)";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(48, 175, 928, 1212, 42); ctx.stroke();

  ctx.strokeStyle = "#C9A227";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(512, 410, 86, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = "#F5D993";
  ctx.font = "400 92px 'Marcellus', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("✦", 512, 442);

  ctx.fillStyle = "#F5D993";
  ctx.font = "700 28px 'DM Sans', sans-serif";
  ctx.fillText("PROTOCOLO SOLAR · VERSO", 512, 565);

  ctx.fillStyle = "rgba(255, 248, 230, 0.68)";
  ctx.font = "700 26px 'DM Sans', sans-serif";
  ctx.fillText(`PRÓXIMO ANIVERSÁRIO · ${nextYear}`, 512, 710);

  ctx.fillStyle = "#FFF4D1";
  ctx.font = "400 104px 'Marcellus', Georgia, serif";
  ctx.fillText("BLOQUEADO", 512, 855);
  ctx.fillStyle = "#F5D993";
  ctx.font = "800 30px 'DM Sans', sans-serif";
  ctx.fillText("ESCOLHA A ENERGIA DO SEU ANO", 512, 930);

  ctx.fillStyle = "rgba(255, 248, 230, 0.72)";
  ctx.font = "500 32px 'DM Sans', sans-serif";
  wrapText(ctx, `Libere seu mapa para descobrir exatamente quais cidades ativam a Casa que você deseja em ${nextYear}.`, 512, 1060, 760, 48, 3);

  ctx.fillStyle = "rgba(245, 217, 147, 0.65)";
  ctx.font = "700 24px ui-monospace, monospace";
  ctx.fillText(`SWISS EPHEMERIS · PS-${h.code} · 365D`, 512, 1320);
  return c;
}

export default function FreeAuditV2() {
  const { locale } = useI18n();
  const ui = V2_UI[locale] || V2_UI.pt;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [noTime, setNoTime] = useState(false);
  const [birthCity, setBirthCity] = useState("");
  const [birthCoords, setBirthCoords] = useState<CityCoords | undefined>();
  const [pastCity, setPastCity] = useState("");
  const [pastCoords, setPastCoords] = useState<CityCoords | undefined>();
  const [sameCity, setSameCity] = useState(false);

  const [loading, setLoading] = useState(false);
  const [cipherText, setCipherText] = useState("CALCULANDO");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    house: HouseV2;
    pastYear: string;
    nextYear: string;
    cityDisplay: string;
    sign: string;
    userName: string;
  } | null>(null);

  const [isMob, setIsMob] = useState(() => typeof window !== "undefined" && window.innerWidth < 820);

  useEffect(() => {
    prewarmSolarApi();
    document.title = "Consulta Grátis — Protocolo Solar";
    const onResize = () => setIsMob(window.innerWidth < 820);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const words = ["SWISS EPHEMERIS", "SOLAR RETURN", "ORBITA 365D"];
    let step = 0;
    const id = window.setInterval(() => {
      const w = words[Math.floor(step / 12) % words.length];
      setCipherText(w.split("").map((c) => (c === " " ? " " : chars[Math.floor(Math.random() * chars.length)])).join(""));
      step++;
    }, 65);
    return () => window.clearInterval(id);
  }, [loading]);

  const sign = getSolarSign(birthDate);

  const badgeCanvases = useMemo(() => {
    if (!result) return null;
    return {
      front: makeFrontBadge(result.house, result.sign, result.userName, result.pastYear, result.nextYear, result.cityDisplay),
      back: makeLockedBackBadge(result.house, result.nextYear),
      strap: makeStrapCanvas()
    };
  }, [result]);

  async function resolveFallback(raw: string): Promise<{ display: string; coords: CityCoords } | null> {
    const q = resolveSearchTerm(raw.trim());
    if (q.length < 2) return null;
    const r = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5&lang=en`);
    if (!r.ok) return null;
    const d = await r.json();
    const f = (d?.features || [])[0];
    if (!f?.geometry?.coordinates) return null;
    const [lon, lat] = f.geometry.coordinates;
    const p = f.properties || {};
    return {
      display: [p.name || raw.trim(), p.state, p.country].filter(Boolean).join(", "),
      coords: { lat: Number(lat), lon: Number(lon) }
    };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!birthDate) { setError("Informe sua data de nascimento."); return; }
    const targetCityRaw = sameCity ? birthCity : pastCity;
    if (!birthCity.trim() || !targetCityRaw.trim()) {
      setError("Informe onde nasceu e onde passou seu último aniversário.");
      return;
    }

    setLoading(true);
    try {
      let resolvedPastCoords = sameCity ? birthCoords : pastCoords;
      let resolvedPastDisplay = targetCityRaw.trim();

      if (!resolvedPastCoords) {
        const fb = await resolveFallback(resolvedPastDisplay);
        if (fb) {
          resolvedPastCoords = fb.coords;
          resolvedPastDisplay = fb.display;
        }
      }
      if (!resolvedPastCoords) {
        throw new Error("Selecione na lista a cidade onde passou seu último aniversário.");
      }

      const cleanName = name.trim() || "Viajante";
      const safeTime = normalizeBirthTime(noTime ? "12:00" : birthTime || "12:00") || "12:00";
      const [yyyy, mm, dd] = birthDate.split("-");
      const dob = `${dd}/${mm}/${yyyy}`;
      const pastYear = getCurrentSolarYear(birthDate);
      const nextYear = getNextBirthdayYear(birthDate);

      // Persistir dados natais para retomada automática em /credits e /perfil
      try {
        sessionStorage.setItem("ps_natal_name", cleanName);
        sessionStorage.setItem("ps_natal_date", birthDate);
        sessionStorage.setItem("ps_natal_time", safeTime);
        sessionStorage.setItem("ps_natal_place", birthCity.trim());
        sessionStorage.setItem("ps_natal_unknown_time", noTime ? "1" : "0");
      } catch { /* ignore */ }

      // APENAS pastYear (ZERO spoiler do próximo aniversário!)
      const res = await fetch(`${API_URL}/audit_past`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          place_of_birth: birthCity.trim(),
          dob,
          time: safeTime,
          past_city: resolvedPastDisplay,
          past_lat: resolvedPastCoords.lat,
          past_lon: resolvedPastCoords.lon,
          target_year: Number(pastYear)
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Não foi possível calcular agora. Tente novamente.");

      const houseId = Math.min(12, Math.max(1, Number(data?.house || data?.sun_house || 1)));
      const house = getHouseV2(houseId);
      setCipherText(`CASA ${house.code} · ${house.cover}`);
      await new Promise((r) => setTimeout(r, 360));

      setResult({
        house,
        pastYear,
        nextYear,
        cityDisplay: resolvedPastDisplay,
        sign: getSolarSign(birthDate),
        userName: cleanName
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err?.message || "Erro ao conectar ao motor astronômico.");
    } finally {
      setLoading(false);
    }
  };

  const bg1 = result ? result.house.bg1 : "#C7DFF8";
  const bg2 = result ? result.house.bg2 : "#9EC2EB";
  const deep = result ? result.house.envDark : "#061844";

  return (
    <div className="v2-root">
      <V2TopNav activeTab="free" backTo={{ label: "← Home", to: "/v2" }} />

      <main
        style={{
          minHeight: "100svh",
          padding: isMob ? "78px 20px calc(108px + env(safe-area-inset-bottom, 0px))" : "96px min(4vw, 56px) 84px",
          background: `linear-gradient(155deg, ${bg1} 0%, ${bg2} 100%)`,
          transition: "background 520ms cubic-bezier(0.22, 1, 0.36, 1)"
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 28px" }}>
            <span style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.84)", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: deep, marginBottom: 14 }}>
              ✦ Consulta Grátis · Cálculo Astronômico Real
            </span>
            <h1 className="v2-serif" style={{ fontSize: "clamp(32px, 4.8vw, 56px)", lineHeight: 1.03, color: deep, marginBottom: 12 }}>
              Por Que Seu Ano Está Assim?
            </h1>
            <p style={{ fontSize: "clamp(15px, 1.5vw, 17px)", lineHeight: 1.48, color: "rgba(16,22,34,0.78)" }}>
              Descubra grátis qual das 12 Casas você ativou no seu último aniversário — e veja na prática se bate com o que você viveu.
            </p>
          </div>

          {!loading && !result && (
            <form
              onSubmit={handleSubmit}
              style={{
                maxWidth: 640,
                margin: "0 auto",
                background: "rgba(255,255,255,0.94)",
                border: "1.5px solid rgba(255,255,255,0.98)",
                borderRadius: isMob ? 24 : 28,
                padding: isMob ? "24px 20px" : "32px 30px",
                boxShadow: "0 32px 72px -24px rgba(16,22,34,0.22)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: deep, opacity: 0.7 }}>
                  Seus dados natais
                </span>
                {sign && (
                  <span style={{ padding: "5px 12px", borderRadius: 999, background: deep, color: "#F5D993", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Sol em {sign}
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="v2Name" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                    Seu nome
                  </label>
                  <input
                    id="v2Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex.: Marina"
                    required
                    style={{ height: 50, padding: "0 15px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16, fontWeight: 600, background: "#FFFFFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="v2Date" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                    Data de nascimento
                  </label>
                  <input
                    id="v2Date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    style={{ height: 50, padding: "0 15px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16, fontWeight: 600, background: "#FFFFFF" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor="v2Time" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                    Horário de nascimento
                  </label>
                  <input
                    id="v2Time"
                    type="time"
                    disabled={noTime}
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    style={{ height: 50, padding: "0 15px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16, fontWeight: 600, background: noTime ? "#F1F5F9" : "#FFFFFF" }}
                  />
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "rgba(16,22,34,0.72)", cursor: "pointer" }}>
                    <input type="checkbox" checked={noTime} onChange={(e) => { setNoTime(e.target.checked); if (e.target.checked) setBirthTime(""); }} />
                    Não sei a hora exata
                  </label>
                </div>

                {/* REUTILIZANDO 100% O CityAutocomplete.tsx REAL DA V1 (COM cityAliases.ts!) */}
                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                    Cidade onde nasceu
                  </label>
                  <CityAutocomplete
                    variant="light"
                    value={birthCity}
                    onChange={(val, _valid, coords) => {
                      setBirthCity(val);
                      setBirthCoords(coords);
                      if (sameCity) {
                        setPastCity(val);
                        setPastCoords(coords);
                      }
                    }}
                    placeholder="Digite e escolha na lista (ex.: Recife, Nova York...)"
                    required
                    className="!h-[50px] !rounded-[14px] !text-[16px] !font-semibold"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                    Onde você passou seu último aniversário?
                  </label>
                  {sameCity ? (
                    <input
                      type="text"
                      disabled
                      value={birthCity}
                      style={{ height: 50, padding: "0 15px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16, fontWeight: 600, background: "#F1F5F9" }}
                    />
                  ) : (
                    <CityAutocomplete
                      variant="light"
                      value={pastCity}
                      onChange={(val, _valid, coords) => {
                        setPastCity(val);
                        setPastCoords(coords);
                      }}
                      placeholder="Digite a cidade e escolha na lista..."
                      required
                      className="!h-[50px] !rounded-[14px] !text-[16px] !font-semibold"
                    />
                  )}
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "rgba(16,22,34,0.72)", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={sameCity}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSameCity(checked);
                        if (checked) {
                          setPastCity(birthCity);
                          setPastCoords(birthCoords);
                        }
                      }}
                    />
                    Passei na mesma cidade em que nasci
                  </label>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", fontSize: 13.5, fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <button className="v2-specular-btn" style={{ width: "100%", marginTop: 20 }} type="submit">
                {ui.ctaConsultNow}
              </button>
              <p style={{ marginTop: 14, textAlign: "center", fontSize: 12, color: "rgba(16,22,34,0.56)" }}>
                Cálculo astronômico real (Swiss Ephemeris) · 100% gratuito · Sem cadastro obrigatório.
              </p>
            </form>
          )}

          {loading && (
            <div style={{ maxWidth: 640, margin: "0 auto", background: "#0B101B", color: "#FFF8E6", borderRadius: 28, padding: "48px 28px", textAlign: "center", boxShadow: "0 32px 72px -20px rgba(11,16,27,0.45)" }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#F5D993", marginBottom: 14 }}>
                Calculando sua Revolução Solar
              </div>
              <div style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, letterSpacing: "0.14em", marginBottom: 12 }}>
                {cipherText}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,248,230,0.68)" }}>
                Posicionando o Sol exato do seu último aniversário...
              </p>
            </div>
          )}

          {result && badgeCanvases && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMob ? "1fr" : "0.9fr 1.1fr",
                gap: 24,
                alignItems: "stretch"
              }}
            >
              {/* CRACHÁ LANYARD 3D REAL (REACT BITS THREE.JS PHYSICS) */}
              <div
                style={{
                  background: "radial-gradient(circle at 50% 38%, rgba(245,217,147,0.14) 0%, #0B101B 64%)",
                  border: "1.5px solid rgba(255,255,255,0.14)",
                  borderRadius: isMob ? 24 : 28,
                  minHeight: isMob ? 450 : 560,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow: "0 30px 70px -20px rgba(11,16,27,0.48)"
                }}
              >
                <div style={{ flex: 1, height: isMob ? 410 : 510 }}>
                  <Lanyard3D
                    frontImage={badgeCanvases.front}
                    backImage={badgeCanvases.back}
                    strapImage={badgeCanvases.strap}
                    cardColor={result.house.env}
                    finish="holographic"
                    metal="gold"
                    size={isMob ? 0.62 : 0.54}
                    strapLength={isMob ? 0.36 : 0.32}
                    damping={0.6}
                    breeze={0.45}
                    interactive
                    intro
                  />
                </div>
                <span style={{ padding: "0 16px 18px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(255,248,230,0.58)", textAlign: "center" }}>
                  Arraste, jogue ou clique para virar o crachá 3D
                </span>
              </div>

              {/* RESULTADO + VÍDEO REAL DA CASA + BLOQUEIO DO PRÓXIMO ANO (SEM SPOILER!) */}
              <div
                style={{
                  background: "rgba(255,255,255,0.94)",
                  border: "1.5px solid rgba(255,255,255,0.98)",
                  borderRadius: isMob ? 24 : 28,
                  padding: isMob ? "22px 20px" : 28,
                  boxShadow: "0 28px 64px -22px rgba(16,22,34,0.18)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 18
                }}
              >
                <div style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 18, overflow: "hidden", background: result.house.envDark }}>
                  <video
                    src={result.house.video}
                    poster={result.house.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: result.house.env, marginBottom: 6 }}>
                    <DecryptedText
                      text={`NO SEU ANIVERSÁRIO DE ${result.pastYear} VOCÊ ATIVOU A CASA ${result.house.code}`}
                      animateOn="view"
                      effect="flip"
                      sequential
                      speed={36}
                      scrambleColor="#C9A227"
                    />
                  </div>
                  <h2 className="v2-serif" style={{ fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.05, color: result.house.envDark }}>
                    {result.house.title}
                  </h2>
                </div>

                <p style={{ fontSize: 15.5, lineHeight: 1.54, color: "#384357" }}>
                  {result.house.copy}
                </p>

                <div style={{ borderRadius: 18, padding: 18, background: "#FAF6F0", border: "1.5px solid rgba(16,22,34,0.08)" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: result.house.env, marginBottom: 6 }}>
                    🔒 SEU PRÓXIMO ANIVERSÁRIO ({result.nextYear}) · BLOQUEADO
                  </div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.48, color: "#101622" }}>
                    Você viu como o lugar do último aniversário definiu o foco do seu ano atual. Agora você não precisa deixar <strong>{result.nextYear}</strong> no acaso — descubra quais cidades (perto de casa ou fora) ativam a Casa que você escolher.
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {/* PASSAGEM CONSISTENTE PARA R$ 19,90 (?pkg=single) OU MAPA COMPLETO (?pkg=full) */}
                  <button
                    type="button"
                    className="v2-specular-btn"
                    style={{ flex: "1 1 210px", height: 52 }}
                    onClick={() => navigate("/credits?pkg=single")}
                  >
                    Liberar meu próximo ano →
                  </button>
                  <button
                    type="button"
                    className="v2-pill-btn"
                    style={{ height: 52, padding: "0 18px", flex: isMob ? "1 1 100%" : undefined, justifyContent: "center" }}
                    onClick={() => navigate("/credits?pkg=full")}
                  >
                    Liberar mapa completo
                  </button>
                  <Link
                    className="v2-pill-btn"
                    style={{ height: 48, padding: "0 16px" }}
                    to={`/v2/casas/${result.house.id}`}
                  >
                    Ver detalhes da Casa {result.house.code}
                  </Link>
                  <button
                    type="button"
                    className="v2-pill-btn"
                    style={{ height: 48, padding: "0 16px" }}
                    onClick={() => setResult(null)}
                  >
                    ↺ Testar outra cidade
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <V2IosTabBar activeTab="free" />
    </div>
  );
}
