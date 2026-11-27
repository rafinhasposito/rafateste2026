import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAffiliate } from "@/hooks/useIsAffiliate";
import { V2TopNav, V2IosTabBar, V2Footer } from "../components/V2Chrome";
import "../v2.css";

const PARTNER_FAQS = [
  {
    q: "Quem pode ser Parceiro do Protocolo Solar?",
    a: "Astrólogos, terapeutas, consultores de viagem, criadores de conteúdo e leitores que já experimentaram a ferramenta e desejam indicar com transparência."
  },
  {
    q: "O preço muda para quem compra pelo meu link?",
    a: "Não. O público encontra exatamente os mesmos preços oficiais (R$ 19,90, R$ 49,90 e R$ 99,90), sem nenhum acréscimo."
  },
  {
    q: "Como funciona a comissão?",
    a: "20% via Pix sobre cada pacote confirmado através do seu link pessoal, com acompanhamento transparente dentro do painel autenticado."
  }
];

export default function PartnersV2() {
  const { user } = useAuth();
  const { isAffiliate } = useIsAffiliate();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Programa Oficial de Parceiros — Protocolo Solar";
  }, []);

  const handleOpenPanel = () => {
    if (user) navigate("/afiliado");
    else navigate("/v2/entrar?returnTo=/afiliado");
  };

  return (
    <div className="v2-root">
      <V2TopNav activeTab="home" backTo={{ label: "← Home", to: "/v2" }} />

      <main style={{ background: "#F4EAE0", padding: "96px min(4vw, 56px) 84px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          <header
            style={{
              borderRadius: 30,
              padding: "44px clamp(20px, 4vw, 48px)",
              background: "radial-gradient(circle at 80% 15%, rgba(245,217,147,0.16) 0%, #0B101B 64%)",
              color: "#FFF8E6",
              textAlign: "center"
            }}
          >
            <span style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 999, background: "rgba(245,217,147,0.14)", color: "#F5D993", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>
              ✦ Programa Oficial de Parceiros
            </span>
            <h1 className="v2-serif" style={{ fontSize: "clamp(30px, 4.6vw, 52px)", lineHeight: 1.04, marginBottom: 14 }}>
              Indique o Protocolo Solar com Transparência e Receba 20% via Pix
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.54, color: "rgba(255,248,230,0.78)", maxWidth: "56ch", margin: "0 auto 24px" }}>
              Painel dedicado, link pessoal rastreado automaticamente, materiais de apoio e mesmos preços oficiais para sua audiência.
            </p>
            <button type="button" className="v2-specular-btn v2-specular-gold" onClick={handleOpenPanel}>
              {isAffiliate ? "Acessar Meu Painel de Parceiro →" : user ? "Ativar Cadastro de Parceiro →" : "Entrar e Ativar Painel →"}
            </button>
          </header>

          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
            {[
              { tag: "20% VIA PIX", title: "Comissão Clara", text: "A cada pacote de créditos confirmado (R$ 19,90, R$ 49,90 ou R$ 99,90), 20% ficam registrados no seu painel." },
              { tag: "RASTREIO REAL", title: "Link Curto Exclusivo", text: "Qualquer clique em protocolosolar.com.br/i/SEUCODIGO preserva sua indicação até o pagamento." },
              { tag: "ÉTICA & VERDADE", title: "Sem Promessas Milagrosas", text: "Ferramenta cultural e informativa (18+) baseada em cálculo astronômico real Swiss Ephemeris." }
            ].map((c) => (
              <div key={c.tag} style={{ background: "rgba(255,255,255,0.94)", borderRadius: 22, padding: 22 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.16em", color: "#C9A227", marginBottom: 6 }}>{c.tag}</div>
                <h2 className="v2-serif" style={{ fontSize: 22, color: "#101622", marginBottom: 6 }}>{c.title}</h2>
                <p style={{ fontSize: 14, lineHeight: 1.52, color: "#384357" }}>{c.text}</p>
              </div>
            ))}
          </section>

          <section style={{ background: "rgba(255,255,255,0.94)", borderRadius: 24, padding: 26 }}>
            <h2 className="v2-serif" style={{ fontSize: 26, color: "#101622", marginBottom: 14 }}>Perguntas de Parceiros</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {PARTNER_FAQS.map((f, i) => (
                <div key={i} style={{ paddingBottom: 12, borderBottom: i < PARTNER_FAQS.length - 1 ? "1px solid rgba(16,22,34,0.08)" : "none" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#101622", marginBottom: 4 }}>{f.q}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.52, color: "#384357" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <V2Footer />
      <V2IosTabBar activeTab="home" />
    </div>
  );
}
