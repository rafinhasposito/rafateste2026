import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { V2TopNav, V2IosTabBar, V2Footer } from "../components/V2Chrome";
import "../v2.css";

const FAQS = [
  {
    q: "Por que o lugar onde passo meu aniversário muda o foco do meu ano?",
    a: "Na Revolução Solar, o instante exato em que o Sol volta ao grau do seu nascimento desenha um novo mapa para os próximos 12 meses. Alterar a latitude e longitude onde você está nesse momento muda qual das 12 Casas ganha protagonismo."
  },
  {
    q: "Preciso viajar para fora do Brasil para ativar a Casa que desejo?",
    a: "Não. Em muitos casos, uma viagem de carro ou fim de semana dentro do próprio Brasil já muda a Casa ativada no seu mapa. Nossa consulta mostra opções perto de casa, no Brasil e no exterior."
  },
  {
    q: "Quanto tempo preciso permanecer na cidade escolhida?",
    a: "O ideal é chegar antes do minuto exato do seu Retorno Solar e permanecer pelo menos 24 horas em solo firme na cidade escolhida."
  },
  {
    q: "Como posso testar na prática antes de pagar?",
    a: "Use nossa Consulta Grátis informando onde você passou seu último aniversário. Você vê imediatamente qual Casa esteve ativa no seu ciclo atual e compara com o que realmente viveu."
  }
];

export default function HowItWorksV2() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  useEffect(() => {
    document.title = "Como Funciona a Revolução Solar — Protocolo Solar";
  }, []);

  return (
    <div className="v2-root">
      <V2TopNav activeTab="guide" backTo={{ label: "← Home", to: "/v2" }} />

      <main style={{ background: "#F4EAE0", padding: "96px min(4vw, 56px) 84px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 36 }}>
          <header style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
            <span style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.86)", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#101622", marginBottom: 14 }}>
              ✦ Guia Rápido · Revolução Solar na Prática
            </span>
            <h1 className="v2-serif" style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.03, color: "#101622", marginBottom: 14 }}>
              Você Não Vê o Sinal. Mas Sente Quando Conecta.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.54, color: "#384357" }}>
              Entenda em 60 segundos como a precisão astronômica (Swiss Ephemeris) transforma o destino do seu aniversário na bússola dos seus próximos 12 meses.
            </p>
          </header>

          {/* 3 PILARES */}
          <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {[
              {
                step: "01 · O PRINCÍPIO",
                title: "12 Casas, 12 Áreas da Vida",
                text: "Todo ano o Sol volta exatamente ao ponto em que estava quando você nasceu. Dependendo de onde você está no globo naquele minuto, uma das 12 Casas assume o comando dos seus próximos 365 dias."
              },
              {
                step: "02 · SEM PASSAPORTE",
                title: "Não Precisa Ir Pra Europa",
                text: "Deslocar a longitude e a latitude já muda a posição do Sol nas Casas. Sempre mostramos destinos acessíveis perto de você, além de opções nacionais e internacionais."
              },
              {
                step: "03 · PRECISÃO REAL",
                title: "Motor Swiss Ephemeris",
                text: "Nenhuma cidade pertence a uma Casa fixa: duas pessoas no mesmo destino ativam Casas diferentes conforme o horário de nascimento. Cada cálculo é 100% individual."
              }
            ].map((card) => (
              <article
                key={card.step}
                style={{
                  background: "rgba(255,255,255,0.94)",
                  borderRadius: 24,
                  padding: 24,
                  border: "1.5px solid rgba(255,255,255,0.98)",
                  boxShadow: "0 20px 50px -24px rgba(16,22,34,0.14)"
                }}
              >
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.16em", color: "#C9A227", marginBottom: 8 }}>
                  {card.step}
                </div>
                <h2 className="v2-serif" style={{ fontSize: 24, color: "#101622", marginBottom: 8 }}>
                  {card.title}
                </h2>
                <p style={{ fontSize: 14.5, lineHeight: 1.56, color: "#384357" }}>{card.text}</p>
              </article>
            ))}
          </section>

          {/* FAQ ACORDEÃO */}
          <section style={{ background: "rgba(255,255,255,0.94)", borderRadius: 28, padding: "28px clamp(18px, 3vw, 34px)" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A227", marginBottom: 6 }}>
              ✦ Dúvidas Frequentes
            </div>
            <h2 className="v2-serif" style={{ fontSize: 30, color: "#101622", marginBottom: 18 }}>
              Tudo o Que Você Precisa Saber
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FAQS.map((item, idx) => {
                const open = openIdx === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 18,
                      border: "1.5px solid rgba(16,22,34,0.08)",
                      background: open ? "#FAF6F0" : "#FFFFFF",
                      overflow: "hidden"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? -1 : idx)}
                      style={{
                        width: "100%",
                        padding: "16px 18px",
                        border: 0,
                        background: "transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        textAlign: "left",
                        fontSize: 15.5,
                        fontWeight: 800,
                        color: "#101622",
                        cursor: "pointer"
                      }}
                    >
                      <span>{item.q}</span>
                      <span>{open ? "−" : "+"}</span>
                    </button>
                    {open && (
                      <div style={{ padding: "0 18px 16px", fontSize: 14.5, lineHeight: 1.56, color: "#384357" }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA FINAL */}
          <section
            style={{
              borderRadius: 28,
              padding: "36px 24px",
              background: "radial-gradient(circle at 80% 20%, rgba(245,217,147,0.16) 0%, #0B101B 62%)",
              color: "#FFF8E6",
              textAlign: "center"
            }}
          >
            <h2 className="v2-serif" style={{ fontSize: "clamp(26px, 3.6vw, 38px)", marginBottom: 10 }}>
              Quer Provar na Prática Agora?
            </h2>
            <p style={{ fontSize: 15.5, color: "rgba(255,248,230,0.78)", maxWidth: "48ch", margin: "0 auto 22px" }}>
              Teste grátis com o seu último aniversário e confira se a Casa ativada bate exatamente com o ano que você viveu.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Link to="/v2/consulta-gratis" className="v2-specular-btn v2-specular-gold">
                Fazer Consulta Grátis →
              </Link>
              <Link to="/v2/consultar" className="v2-pill-btn" style={{ height: 54, padding: "0 22px" }}>
                Planejar próximo aniversário
              </Link>
            </div>
          </section>
        </div>
      </main>

      <V2Footer />
      <V2IosTabBar activeTab="home" />
    </div>
  );
}
