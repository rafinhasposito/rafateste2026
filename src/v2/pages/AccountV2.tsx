import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CityAutocomplete from "@/components/CityAutocomplete";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { supabase } from "@/integrations/supabase/client";
import { normalizeBirthTime } from "@/lib/astro";
import { Lanyard3D } from "../components/Lanyard3D";
import { V2TopNav, V2IosTabBar, V2Footer } from "../components/V2Chrome";
import "../v2.css";

interface ConsultRow {
  id: string;
  name: string;
  year: string;
  mode: string;
  goal: number | null;
  origin: string | null;
  created_at: string;
}

function makeAccountCard(name: string, credits: number, city: string, isFront: boolean) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1440;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 1024, 1440);
  grad.addColorStop(0, isFront ? "#0E2D6B" : "#101624");
  grad.addColorStop(1, "#060D1E");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1440);

  ctx.strokeStyle = "rgba(245, 217, 147, 0.36)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(48, 175, 928, 1212, 42);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#F5D993";
  ctx.font = "700 28px 'DM Sans', sans-serif";
  ctx.fillText(isFront ? "PASSAPORTE DO MEMBRO" : "PROTOCOLO SOLAR · OFICIAL", 512, 260);

  if (isFront) {
    ctx.fillStyle = "#FFF4D1";
    ctx.font = "400 240px 'Marcellus', Georgia, serif";
    ctx.fillText(String(credits), 512, 650);
    ctx.fillStyle = "#F5D993";
    ctx.font = "800 32px 'DM Sans', sans-serif";
    ctx.fillText(credits === 1 ? "CRÉDITO DISPONÍVEL" : "CRÉDITOS DISPONÍVEIS", 512, 740);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 46px 'DM Sans', sans-serif";
    ctx.fillText((name || "Viajante").slice(0, 20), 512, 1020);
    ctx.fillStyle = "rgba(255,248,230,0.7)";
    ctx.font = "600 30px 'DM Sans', sans-serif";
    ctx.fillText((city || "Dados natais salvos no perfil").slice(0, 32), 512, 1090);
  } else {
    ctx.fillStyle = "#FFF4D1";
    ctx.font = "400 92px 'Marcellus', Georgia, serif";
    ctx.fillText("✦", 512, 540);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 36px 'DM Sans', sans-serif";
    ctx.fillText("SWISS EPHEMERIS · 365D", 512, 740);
    ctx.fillStyle = "rgba(255,248,230,0.7)";
    ctx.font = "500 28px 'DM Sans', sans-serif";
    ctx.fillText("Seu histórico e créditos nunca expiram.", 512, 830);
  }
  return c;
}

function makeStrap() {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 192;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#10141F";
  ctx.fillRect(0, 0, 768, 192);
  ctx.fillStyle = "#F5D993";
  ctx.font = "700 34px 'DM Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("✦   PROTOCOLO SOLAR   ✦", 384, 98);
  return c;
}

export default function AccountV2() {
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { isAffiliate } = useIsAffiliate();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [birthCoords, setBirthCoords] = useState<{ lat: number; lon: number } | undefined>();
  const [saving, setSaving] = useState(false);
  const [consultations, setConsultations] = useState<ConsultRow[]>([]);
  const [isMob, setIsMob] = useState(() => typeof window !== "undefined" && window.innerWidth < 820);

  useEffect(() => {
    document.title = "Minha Conta — Protocolo Solar";
    const onResize = () => setIsMob(window.innerWidth < 820);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/v2/entrar?returnTo=/v2/perfil", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, birth_date, birth_time, birth_city, birth_lat, birth_lon")
        .eq("user_id", user.id)
        .maybeSingle();

      if (alive && prof) {
        setFullName(prof.full_name || profile?.display_name || sessionStorage.getItem("ps_natal_name") || "");
        setBirthDate(prof.birth_date || sessionStorage.getItem("ps_natal_date") || "");
        setBirthTime(prof.birth_time ? String(prof.birth_time).slice(0, 5) : sessionStorage.getItem("ps_natal_time") || "");
        setBirthCity(prof.birth_city || sessionStorage.getItem("ps_natal_place") || "");
        if (prof.birth_lat && prof.birth_lon) {
          setBirthCoords({ lat: Number(prof.birth_lat), lon: Number(prof.birth_lon) });
        }
      }

      const { data: rows } = await supabase
        .from("consultations")
        .select("id, name, year, mode, goal, origin, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (alive && rows) setConsultations(rows as ConsultRow[]);
    })();
    return () => { alive = false; };
  }, [user, profile?.display_name]);

  const lanyardCanvases = useMemo(() => {
    const credits = profile?.credits ?? 0;
    return {
      front: makeAccountCard(fullName || profile?.display_name || "Viajante", credits, birthCity, true),
      back: makeAccountCard(fullName || profile?.display_name || "Viajante", credits, birthCity, false),
      strap: makeStrap()
    };
  }, [fullName, profile?.display_name, profile?.credits, birthCity]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const safeTime = normalizeBirthTime(birthTime || "12:00") || "12:00";
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          birth_date: birthDate || null,
          birth_time: safeTime,
          birth_city: birthCity.trim() || null,
          ...(birthCoords ? { birth_lat: birthCoords.lat, birth_lon: birthCoords.lon } : {})
        })
        .eq("user_id", user.id);

      if (error) throw error;
      sessionStorage.setItem("ps_natal_name", fullName.trim());
      if (birthDate) sessionStorage.setItem("ps_natal_date", birthDate);
      sessionStorage.setItem("ps_natal_time", safeTime);
      if (birthCity) sessionStorage.setItem("ps_natal_place", birthCity.trim());
      await refreshProfile();
      toast.success("Dados natais salvos com sucesso!");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="v2-root">
      <V2TopNav activeTab="account" backTo={{ label: "← Home", to: "/v2" }} />

      <main
        style={{
          minHeight: "100svh",
          background: "linear-gradient(155deg, #F4EAE0 0%, #EADAC8 100%)",
          padding: isMob ? "78px 20px 64px" : "96px min(4vw, 56px) 84px"
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "0.85fr 1.15fr", gap: 24, alignItems: "stretch" }}>
            {/* PERSONAL 3D LANYARD PASS */}
            <div
              style={{
                background: "radial-gradient(circle at 50% 35%, rgba(245,217,147,0.16) 0%, #0B101B 64%)",
                borderRadius: 28,
                minHeight: isMob ? 430 : 520,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 28px 64px -20px rgba(11,16,27,0.42)"
              }}
            >
              <div style={{ flex: 1, height: isMob ? 380 : 470 }}>
                <Lanyard3D
                  frontImage={lanyardCanvases.front}
                  backImage={lanyardCanvases.back}
                  strapImage={lanyardCanvases.strap}
                  cardColor="#0E2D6B"
                  finish="holographic"
                  metal="gold"
                  size={isMob ? 0.6 : 0.52}
                  strapLength={0.34}
                  damping={0.6}
                  breeze={0.45}
                  interactive
                  intro
                />
              </div>
              <div style={{ padding: "0 16px 18px", textAlign: "center", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,248,230,0.62)" }}>
                Arraste ou clique para virar seu passaporte
              </div>
            </div>

            {/* NATAL DATA + QUICK ACTIONS */}
            <div
              style={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: 28,
                padding: isMob ? "22px 18px" : "30px 30px",
                boxShadow: "0 24px 60px -24px rgba(16,22,34,0.16)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 20
              }}
            >
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A227" }}>
                      ✦ Minha Conta
                    </div>
                    <h1 className="v2-serif" style={{ fontSize: "clamp(26px, 3.2vw, 36px)", color: "#101622" }}>
                      {fullName || profile?.display_name || user.email}
                    </h1>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link to="/v2/creditos" className="v2-specular-btn" style={{ height: 42, padding: "0 16px", fontSize: 13 }}>
                      + Comprar créditos
                    </Link>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.6)" }}>
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ height: 48, padding: "0 14px", borderRadius: 12, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 15 }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.6)" }}>
                      Data de nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      style={{ height: 48, padding: "0 14px", borderRadius: 12, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 15 }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.6)" }}>
                      Horário de nascimento
                    </label>
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      style={{ height: 48, padding: "0 14px", borderRadius: 12, border: "1.5px solid rgba(16,22,34,0.14)", fontSize: 15 }}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(16,22,34,0.6)" }}>
                      Cidade de nascimento
                    </label>
                    <CityAutocomplete
                      value={birthCity}
                      onChange={(val, coords) => {
                        setBirthCity(val);
                        if (coords) setBirthCoords(coords);
                      }}
                      placeholder="Ex.: São Paulo, SP"
                      variant="light"
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1", display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
                    <button type="submit" disabled={saving} className="v2-specular-btn" style={{ height: 48, padding: "0 22px" }}>
                      {saving ? "Salvando..." : "Salvar dados natais"}
                    </button>
                    <Link to="/v2/consultar" className="v2-pill-btn" style={{ height: 48, padding: "0 18px" }}>
                      Nova consulta →
                    </Link>
                    {isAffiliate && (
                      <Link to="/afiliado" className="v2-pill-btn" style={{ height: 48, padding: "0 18px" }}>
                        Painel de Parceiro
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="v2-pill-btn" style={{ height: 48, padding: "0 18px" }}>
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      className="v2-pill-btn"
                      style={{ height: 48, padding: "0 18px" }}
                      onClick={async () => {
                        await signOut();
                        navigate("/v2");
                      }}
                    >
                      Sair
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* HISTÓRICO DE CONSULTAS REAL (SUPABASE) */}
          <section
            style={{
              background: "rgba(255,255,255,0.94)",
              borderRadius: 28,
              padding: isMob ? "22px 18px" : "30px 30px",
              boxShadow: "0 20px 54px -24px rgba(16,22,34,0.14)"
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A227", marginBottom: 6 }}>
              ✦ Seus Mapas Salvos
            </div>
            <h2 className="v2-serif" style={{ fontSize: 28, color: "#101622", marginBottom: 16 }}>
              Histórico de Consultas ({consultations.length})
            </h2>

            {consultations.length === 0 ? (
              <div style={{ padding: 24, borderRadius: 20, background: "#FAF6F0", textAlign: "center" }}>
                <p style={{ fontSize: 15, color: "#384357", marginBottom: 14 }}>
                  Você ainda não salvou nenhuma consulta paga nesta conta.
                </p>
                <Link to="/v2/consultar" className="v2-specular-btn">
                  Fazer minha primeira consulta →
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
                {consultations.map((row) => {
                  const targetHouse = Math.min(12, Math.max(1, Number(row.goal) || 1));
                  return (
                    <Link
                      key={row.id}
                      to={`/v2/resultado/${targetHouse}?consultationId=${row.id}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px 18px",
                        borderRadius: 18,
                        background: "#FAF6F0",
                        border: "1.5px solid rgba(16,22,34,0.08)",
                        textDecoration: "none",
                        color: "#101622"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C9A227" }}>
                          Ciclo {row.year} · Casa {String(targetHouse).padStart(2, "0")}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800 }}>{row.origin || row.name}</div>
                        <div style={{ fontSize: 12.5, color: "#384357" }}>
                          {new Date(row.created_at).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 13 }}>Abrir →</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <V2Footer />
      <V2IosTabBar activeTab="account" />
    </div>
  );
}
