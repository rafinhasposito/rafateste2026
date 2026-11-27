import { useEffect } from "react";
import { V2TopNav, V2IosTabBar, V2Footer } from "../components/V2Chrome";
import "../v2.css";

export default function LegalV2({ doc }: { doc: "terms" | "privacy" }) {
  const isTerms = doc === "terms";

  useEffect(() => {
    document.title = isTerms ? "Termos de Uso — Protocolo Solar" : "Política de Privacidade — Protocolo Solar";
  }, [isTerms]);

  return (
    <div className="v2-root">
      <V2TopNav activeTab="home" backTo={{ label: "← Home", to: "/v2" }} />

      <main style={{ background: "#F4EAE0", padding: "96px 20px 84px" }}>
        <article
          style={{
            maxWidth: 780,
            margin: "0 auto",
            background: "rgba(255,255,255,0.95)",
            borderRadius: 28,
            padding: "32px clamp(20px, 4vw, 40px)",
            boxShadow: "0 20px 54px -24px rgba(16,22,34,0.14)",
            color: "#384357",
            lineHeight: 1.65,
            fontSize: 15
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#C9A227", marginBottom: 8 }}>
            ✦ Protocolo Solar · Documentação Oficial
          </div>
          <h1 className="v2-serif" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: "#101622", marginBottom: 20 }}>
            {isTerms ? "Termos de Uso" : "Política de Privacidade (LGPD)"}
          </h1>

          {isTerms ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p>
                O <strong>Protocolo Solar</strong> é uma plataforma digital cultural, educativa e informativa voltada a maiores de 18 anos para cálculo astronômico de Revolução Solar (Swiss Ephemeris) e planejamento pessoal de aniversário.
              </p>
              <p>
                <strong>Sem promessa determinística:</strong> as leituras e recomendações de destinos representam tendências simbólicas tradicionais da astrologia de relocalização e não substituem aconselhamento médico, psicológico, financeiro ou jurídico.
              </p>
              <p>
                <strong>Créditos e Pagamento Único:</strong> os pacotes oficiais (1 Crédito — R$ 19,90; 3 Créditos — R$ 49,90; Mapa Completo 12 Casas — R$ 99,90) são cobrados em pagamento único via Mercado Pago (Pix ou Cartão), sem assinatura recorrente. Cada crédito libera 1 Casa ou 1 Cidade completa com todas as 8 áreas da vida abertas.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p>
                Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), coletamos apenas os dados estritamente necessários para realizar o cálculo astronômico individual (nome, data, hora e cidade de nascimento) e gerenciar sua conta e histórico de consultas.
              </p>
              <p>
                <strong>Segurança de Pagamentos:</strong> todos os pagamentos são processados diretamente pelo Mercado Pago; nunca armazenamos dados de cartão de crédito em nossos servidores.
              </p>
              <p>
                Você pode atualizar ou solicitar a exclusão definitiva dos seus dados a qualquer momento pela sua conta ou pelos canais oficiais de suporte do Protocolo Solar.
              </p>
            </div>
          )}
        </article>
      </main>

      <V2Footer />
      <V2IosTabBar activeTab="home" />
    </div>
  );
}
