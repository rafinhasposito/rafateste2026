import { GoogleGenAI } from "@google/genai";
import { ATLAS_DO_DESTINO, ZodiacElement } from "@/data/atlas";

// Initialize Gemini SDK with the API key from environment variables
// Note: In production, this should ideally run on a secure backend/Edge Function
// so the API key isn't exposed to the client.
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY",
});

export interface ConciergeRequest {
  houseNumber: number;
  element: ZodiacElement;
  cityName: string;
  userName?: string;
  intent?: string;
}

export const generateDestinyInsight = async (req: ConciergeRequest): Promise<string> => {
  const houseData = ATLAS_DO_DESTINO[req.houseNumber];
  
  if (!houseData) {
    throw new Error("Casa astrológica inválida.");
  }

  const bussola = houseData.bussola[req.element];
  
  const systemPrompt = `Você é o Concierge Digital Premium do Protocolo Solar, um serviço de Astrocartografia de altíssimo nível.
Sua missão é escrever um Insight de Destino (1 a 2 parágrafos no máximo) para o usuário.
O tom de voz deve ser elegante, direto, sofisticado e magnético (estilo luxo discreto, "quiet luxury").
Evite clichês de astrologia barata; use termos como "coordenada geográfica", "ancorar o Sol", "frequência", "matriz".

DADOS DA ANÁLISE:
- Casa Astrológica Ativada: ${req.houseNumber} (${houseData.title})
- Tesouro desta Casa: ${houseData.tesouro}
- Cidade Recomendada: ${req.cityName}
- Elemento do Signo na Cidade: ${req.element}
- Manifestação do Elemento: ${bussola}
${req.userName ? `- Nome do Cliente: ${req.userName}` : ""}
${req.intent ? `- Intenção do Cliente: ${req.intent}` : ""}

Crie o insight persuasivo recomendando que ele passe o aniversário em ${req.cityName} para destravar esse destino.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });
    
    return response.text || "Insight gerado não disponível no momento.";
  } catch (error) {
    console.error("Erro no Concierge IA:", error);
    // Fallback gracioso usando o texto do Atlas
    return `Ao ancorar seu Sol em ${req.cityName}, você ativa a ${houseData.title}. O foco do seu ano será: ${houseData.tesouro}. A energia do elemento ${req.element} indica: ${bussola}`;
  }
};
