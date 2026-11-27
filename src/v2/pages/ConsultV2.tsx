import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CityAutocomplete, { type CityCoords } from "@/components/CityAutocomplete";
import { API_URL, getNextBirthdayYear, normalizeBirthTime } from "@/lib/astro";
import { resolveSearchTerm } from "@/lib/cityAliases";
import { chargeAndSaveConsultationV1, enrichResultForTier } from "@/lib/consultations";
import { prewarmSolarApi } from "@/lib/pastAuditClient";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { HOUSES_V2, getHouseV2 } from "../data/housesV2";
import { getEnvelopeDataUrl } from "../components/envelopeCanvas";
import { V2TopNav, V2IosTabBar, V2Footer } from "../components/V2Chrome";
import "../v2.css";

type ConsultMode = "city" | "house" | "intent";

const INTENTIONS = [
  { id: "dinheiro", label: "Dinheiro & Caixa Forte", sub: "Prosperidade, receita e valorização", houseId: 2, icon: "✦" },
  { id: "amor", label: "Amor & Parceria Madura", sub: "Relacionamento sério ou sociedades", houseId: 7, icon: "♥" },
  { id: "carreira", label: "Carreira & Topo", sub: "Autoridade, liderança e visibilidade", houseId: 10, icon: "▲" },
  { id: "saude", label: "Saúde & Rotina Leve", sub: "Constância, corpo e produtividade", houseId: 6, icon: "●" },
  { id: "viagens", label: "Viagens & Expansão", sub: "Liberdade, exterior e novos horizontes", houseId: 9, icon: "✈" },
  { id: "paz", label: "Paz & Recarga Profunda", sub: "Intuição, calma e fechamento de ciclo", houseId: 12, icon: "☾" }
];

export default function ConsultV2() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, refreshProfile } = useAuth();
  const { isAdmin } = useIsAdmin();

  const initialMode = (searchParams.get("mode") as ConsultMode) || "house";
  const initialHouse = Number(searchParams.get("house")) || 2;

  const [mode, setMode] = useState<ConsultMode>(["city", "house", "intent"].includes(initialMode) ? initialMode : "house");
  const [selectedHouse, setSelectedHouse] = useState<number>(Math.min(12, Math.max(1, initialHouse)));
  const [selectedIntent, setSelectedIntent] = useState<string>("dinheiro");

  const [name, setName] = useState(() => sessionStorage.getItem("ps_natal_name") || profile?.display_name || "");
  const [birthDate, setBirthDate] = useState(() => sessionStorage.getItem("ps_natal_date") || "");
  const [birthTime, setBirthTime] = useState(() => sessionStorage.getItem("ps_natal_time") || "");
  const [noTime, setNoTime] = useState(() => sessionStorage.getItem("ps_natal_unknown_time") === "1");
  const [birthCity, setBirthCity] = useState(() => sessionStorage.getItem("ps_natal_place") || "");
  const [birthCoords, setBirthCoords] = useState<CityCoords | undefined>();

  const [targetCity, setTargetCity] = useState("");
  const [targetCoords, setTargetCoords] = useState<CityCoords | undefined>();
  const [targetYear, setTargetYear] = useState(() => getNextBirthdayYear(sessionStorage.getItem("ps_natal_date")));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMob, setIsMob] = useState(() => typeof window !== "undefined" && window.innerWidth < 820);

  const envUrls = useMemo(() => HOUSES_V2.map((h) => getEnvelopeDataUrl(h)), []);
  const activeHouseObj = getHouseV2(selectedHouse);
  const availableCredits = profile?.credits ?? 0;

  useEffect(() => {
    prewarmSolarApi();
    document.title = "Consultar Meu Próximo Ano — Protocolo Solar";
    const onResize = () => setIsMob(window.innerWidth < 820);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (birthDate) setTargetYear(getNextBirthdayYear(birthDate));
  }, [birthDate]);

  async function resolveCityFallback(raw: string): Promise<{ display: string; coords: CityCoords } | null> {
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
    if (!birthDate || !birthCity.trim()) {
      setError("Informe sua data e cidade de nascimento.");
      return;
    }
    if (mode === "city" && !targetCity.trim()) {
      setError("Digite a cidade onde você pensa em passar seu próximo aniversário.");
      return;
    }

    const cleanName = name.trim() || "Viajante";
    const safeTime = normalizeBirthTime(noTime ? "12:00" : birthTime || "12:00") || "12:00";
    const desiredHouse =
      mode === "intent"
        ? INTENTIONS.find((i) => i.id === selectedIntent)?.houseId || 2
        : selectedHouse;

    try {
      sessionStorage.setItem("ps_natal_name", cleanName);
      sessionStorage.setItem("ps_natal_date", birthDate);
      sessionStorage.setItem("ps_natal_time", safeTime);
      sessionStorage.setItem("ps_natal_place", birthCity.trim());
      sessionStorage.setItem("ps_natal_unknown_time", noTime ? "1" : "0");
    } catch { /* ignore */ }

    // Gate real: consulta do futuro exige conta + crédito (ou admin)
    if (!user) {
      navigate(`/v2/entrar?returnTo=${encodeURIComponent(`/v2/consultar?mode=${mode}&house=${desiredHouse}`)}`);
      return;
    }
    if (!isAdmin && availableCredits < 1) {
      navigate(`/v2/creditos?pkg=single&returnTo=${encodeURIComponent(`/v2/consultar?mode=${mode}&house=${desiredHouse}`)}`);
      return;
    }

    setLoading(true);
    try {
      const [yyyy, mm, dd] = birthDate.split("-");
      const dob = `${dd}/${mm}/${yyyy}`;

      if (mode === "city") {
        let coords = targetCoords;
        let cityDisplay = targetCity.trim();
        if (!coords) {
          const fb = await resolveCityFallback(cityDisplay);
          if (fb) { coords = fb.coords; cityDisplay = fb.display; }
        }
        if (!coords) throw new Error("Selecione uma cidade válida na lista de sugestões.");

        const auditResp = await fetch(`${API_URL}/audit_past`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            place_of_birth: birthCity.trim(),
            dob,
            time: safeTime,
            past_city: cityDisplay,
            past_lat: coords.lat,
            past_lon: coords.lon,
            target_year: Number(targetYear)
          })
        });
        const auditData = await auditResp.json().catch(() => ({}));
        if (!auditResp.ok) throw new Error(auditData?.error || "Não foi possível calcular esta cidade agora.");

        const houseNum = Math.min(12, Math.max(1, Number(auditData?.house || auditData?.sun_house || 1)));

        // Enrich with all 12 houses for seamless unlocking later
        let allResults: Record<string, any> = {};
        try {
          const enrichResp = await fetch(`${API_URL}/find_all_cities`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: cleanName,
              place_of_birth: birthCity.trim(),
              dob,
              time: safeTime,
              target_year: targetYear,
              alvoId: houseNum
            })
          });
          if (enrichResp.ok) {
            const enrichData = await enrichResp.json();
            if (enrichData?.results) allResults = enrichData.results;
          }
        } catch { /* non-fatal */ }

        const payload = enrichResultForTier(
          {
            results: allResults,
            house: houseNum,
            chosen_city: cityDisplay,
            return_time_utc: auditData?.return_time_utc || null,
            return_date: auditData?.return_date || null,
            sun_sign: auditData?.sun_sign || null,
            ascendant: auditData?.ascendant || null
          },
          "single",
          houseNum
        );

        let consultationId: string | undefined;
        if (!isAdmin) {
          consultationId =
            (await chargeAndSaveConsultationV1({
              id: crypto.randomUUID(),
              userId: user.id,
              name: cleanName,
              birthdate: birthDate,
              birthtime: safeTime,
              birth_place: birthCity.trim(),
              year: targetYear,
              mode: "presente",
              goal: houseNum,
              origin: cityDisplay,
              result: payload
            })) ?? undefined;
          await refreshProfile();
        }

        navigate(`/v2/resultado/${houseNum}${consultationId ? `?consultationId=${consultationId}` : ""}`, {
          state: {
            consultationId,
            userName: cleanName,
            targetYear,
            chosenCity: cityDisplay,
            unlocked: true,
            payload
          }
        });
        return;
      }

      // Modes "house" or "intent": real POST /find_all_cities
      const resp = await fetch(`${API_URL}/find_all_cities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          place_of_birth: birthCity.trim(),
          dob,
          time: safeTime,
          target_year: targetYear,
          alvoId: desiredHouse
        })
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || "Não foi possível calcular seu mapa agora.");

      const payload = enrichResultForTier(
        {
          results: data?.results || {},
          house: desiredHouse,
          return_time_utc: data?.return_time_utc || null,
          return_date: data?.return_date || null,
          sun_sign: data?.sun_sign || null,
          ascendant: data?.ascendant || null
        },
        "single",
        desiredHouse
      );

      let consultationId: string | undefined;
      if (!isAdmin) {
        consultationId =
          (await chargeAndSaveConsultationV1({
            id: crypto.randomUUID(),
            userId: user.id,
            name: cleanName,
            birthdate: birthDate,
            birthtime: safeTime,
            birth_place: birthCity.trim(),
            year: targetYear,
            mode: "futuro",
            goal: desiredHouse,
            intent: mode === "intent" ? selectedIntent : null,
            result: payload
          })) ?? undefined;
        await refreshProfile();
      }

      navigate(`/v2/resultado/${desiredHouse}${consultationId ? `?consultationId=${consultationId}` : ""}`, {
        state: {
          consultationId,
          userName: cleanName,
          targetYear,
          unlocked: true,
          payload
        }
      });
    } catch (err: any) {
      setError(err?.message || "Erro ao consultar o motor astronômico.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v2-root">
      <V2TopNav activeTab="consult" backTo={{ label: "← Home", to: "/v2" }} />

      <main
        style={{
          minHeight: "100svh",
          padding: isMob ? "78px 20px 64px" : "96px min(4vw, 56px) 84px",
          background: `linear-gradient(155deg, ${activeHouseObj.bg1} 0%, ${activeHouseObj.bg2} 100%)`,
          transition: "background 420ms cubic-bezier(0.22, 1, 0.36, 1)"
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 28px" }}>
            <span
              style={{
                display: "inline-flex",
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.86)",
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: activeHouseObj.envDark,
                marginBottom: 14
              }}
            >
              ✦ Consulta Solar {targetYear} · {user ? `${isAdmin ? "Admin" : `${availableCredits} crédito(s)`}` : "Swiss Ephemeris Real"}
            </span>
            <h1 className="v2-serif" style={{ fontSize: "clamp(32px, 4.8vw, 54px)", lineHeight: 1.03, color: activeHouseObj.envDark, marginBottom: 12 }}>
              Escolha Onde Passar Seu Aniversário
            </h1>
            <p style={{ fontSize: "clamp(14.5px, 1.4vw, 17px)", lineHeight: 1.5, color: "rgba(16,22,34,0.78)" }}>
              Consulte por <strong>Cidade</strong>, por <strong>Casa Solar</strong> ou pela sua <strong>Intenção</strong> principal — usando o mesmo motor astronômico de precisão do Protocolo Solar.
            </p>
          </div>

          {/* 3-MODE SEGMENTED BAR */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 6,
              padding: 6,
              borderRadius: 999,
              background: "rgba(255,255,255,0.68)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(16,22,34,0.1)",
              maxWidth: 520,
              margin: "0 auto 24px"
            }}
          >
            {[
              { id: "house" as const, label: "Por Casa" },
              { id: "city" as const, label: "Por Cidade" },
              { id: "intent" as const, label: "Por Intenção" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id)}
                style={{
                  height: 44,
                  border: 0,
                  borderRadius: 999,
                  background: mode === tab.id ? "#101622" : "transparent",
                  color: mode === tab.id ? "#FFF8E6" : "#101622",
                  fontSize: 13.5,
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "background 220ms ease, color 220ms ease"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1.5px solid rgba(255,255,255,0.99)",
              borderRadius: isMob ? 24 : 30,
              padding: isMob ? "22px 18px" : "32px 32px",
              boxShadow: "0 32px 72px -24px rgba(16,22,34,0.22)"
            }}
          >
            {/* MODE-SPECIFIC PICKER */}
            {mode === "house" && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: activeHouseObj.env, marginBottom: 12 }}>
                  1. Qual Casa você quer ativar em {targetYear}?
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMob ? "repeat(3, 1fr)" : "repeat(6, 1fr)",
                    gap: 8
                  }}
                >
                  {HOUSES_V2.map((h, i) => {
                    const active = h.id === selectedHouse;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHouse(h.id)}
                        style={{
                          padding: "10px 6px",
                          borderRadius: 16,
                          border: active ? `2px solid ${h.env}` : "1.5px solid rgba(16,22,34,0.08)",
                          background: active ? h.bg1 : "#FAF6F0",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 6,
                          cursor: "pointer",
                          transition: "transform 180ms ease, border-color 180ms ease"
                        }}
                      >
                        <img src={envUrls[i]} alt={`Casa ${h.code}`} style={{ height: 54, width: "auto" }} />
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: h.envDark }}>
                          {h.code} · {h.cover.split(" & ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === "intent" && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: activeHouseObj.env, marginBottom: 12 }}>
                  1. Qual é seu principal objetivo para {targetYear}?
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
                  {INTENTIONS.map((item) => {
                    const active = selectedIntent === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedIntent(item.id);
                          setSelectedHouse(item.houseId);
                        }}
                        style={{
                          textAlign: "left",
                          padding: "14px 16px",
                          borderRadius: 18,
                          border: active ? "2px solid #101622" : "1.5px solid rgba(16,22,34,0.1)",
                          background: active ? "#101622" : "#FAF6F0",
                          color: active ? "#FFF8E6" : "#101622",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.12em", color: active ? "#F5D993" : "#C9A227", marginBottom: 4 }}>
                          {item.icon} CASA {String(item.houseId).padStart(2, "0")}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: 12.5, opacity: 0.74 }}>{item.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === "city" && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: activeHouseObj.env, marginBottom: 8 }}>
                  1. Qual cidade você quer testar para {targetYear}?
                </label>
                <CityAutocomplete
                  value={targetCity}
                  onChange={(val, coords) => {
                    setTargetCity(val);
                    setTargetCoords(coords);
                  }}
                  placeholder="Ex.: Nova York, Lisboa, Florianópolis..."
                  variant="light"
                />
              </div>
            )}

            {/* NATAL DATA */}
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(16,22,34,0.6)", marginBottom: 12 }}>
              2. Seus dados natais (para cálculo astronômico individual)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "1fr 1fr", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="cName" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                  Seu nome
                </label>
                <input
                  id="cName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Marina"
                  required
                  style={{ height: 50, padding: "0 14px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16, fontWeight: 600 }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="cYear" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                  Ano do aniversário
                </label>
                <input
                  id="cYear"
                  type="number"
                  min={2025}
                  max={2035}
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  style={{ height: 50, padding: "0 14px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16, fontWeight: 700 }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="cDate" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                  Data de nascimento
                </label>
                <input
                  id="cDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  style={{ height: 50, padding: "0 14px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16, fontWeight: 600 }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="cTime" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                  Horário de nascimento
                </label>
                <input
                  id="cTime"
                  type="time"
                  value={birthTime}
                  disabled={noTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  style={{ height: 50, padding: "0 14px", borderRadius: 14, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 16, fontWeight: 600, opacity: noTime ? 0.45 : 1 }}
                />
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#384357", cursor: "pointer" }}>
                  <input type="checkbox" checked={noTime} onChange={(e) => setNoTime(e.target.checked)} />
                  Não sei a hora exata
                </label>
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.62)" }}>
                  Cidade onde você nasceu
                </label>
                <CityAutocomplete
                  value={birthCity}
                  onChange={(val, coords) => {
                    setBirthCity(val);
                    setBirthCoords(coords);
                  }}
                  placeholder="Ex.: São Paulo, Rio de Janeiro, Recife..."
                  variant="light"
                />
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", fontSize: 13.5, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
              <button type="submit" disabled={loading} className="v2-specular-btn" style={{ flex: "1 1 260px" }}>
                {loading
                  ? "Calculando seu mapa solar..."
                  : !user
                    ? "Entrar e calcular meu ano →"
                    : !isAdmin && availableCredits < 1
                      ? "Liberar créditos e consultar →"
                      : "Calcular agora (1 crédito) →"}
              </button>
              <Link to="/v2/consulta-gratis" className="v2-pill-btn" style={{ height: 54, padding: "0 20px", justifyContent: "center" }}>
                Testar último aniversário grátis
              </Link>
            </div>
          </form>
        </div>
      </main>

      <V2Footer />
      <V2IosTabBar activeTab="consult" />
    </div>
  );
}
