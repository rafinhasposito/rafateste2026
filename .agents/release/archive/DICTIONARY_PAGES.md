# DICIONÁRIO E LEIS DAS PÁGINAS DO PROJETO
*Criado para evitar que o Agente se perca no propósito do produto e pare de cometer erros conceituais.*

## 1. O V4 / V5 (A Página de Resultados) - Rota: `/v4-preview` / `/v5-preview`
**O que é:** É a página MAIS IMPORTANTE do projeto. É o Dashboard de Resultado Final (Dossiê) do cliente.
**A Lei de Ouro (O Camaleão):** O V4 NÃO É uma página estática. Ele é um molde vivo que reflete as 12 Casas Astrológicas. 
* Se o usuário clica para destravar a Casa 1, o V4 INTEIRO tem que assumir a Personalidade da Casa 1.
* Isso significa: A cor de TODOS os ícones e gradientes muda. O Texto do Tema muda. O Segredo muda. O Ritual muda. As 3 Fases mudam. A imagem da cidade muda.
* **Proibido:** Deixar "restos" de outras Casas (ex: mudar o texto mas deixar o topo verde da Casa 2). A transformação tem que ser absoluta, de ponta a ponta da tela.

## 2. O V3 (O Masterpiece Visual) - Rota: `/v3-preview`
**O que é:** É o template original com o design final aprovado (Corte das imagens, Grid de Casas, Efeito Vidro Escuro). 
**Propósito:** Serviu de casca e referência intocável de CSS/Tailwind para criarmos a Gamificação no V4.

## 3. Trailer da Casa - Rota: `/house-trailer`
**O que é:** A experiência imersiva de transição. Fica entre o Onboarding e a Página de Resultados (V4).
**Propósito:** Mostrar um vídeo 3D de alta qualidade com o nome da Cidade e as palavras-chave do ano do usuário (ex: Dinheiro, Foco) para gerar antecipação extrema antes de entregar o V4.

## 4. Onboarding Mobile / Desktop
**O que é:** O fluxo inicial onde o cliente digita data de nascimento, hora, cidade atual, etc.
**Propósito:** Coletar os dados para que o motor astrológico calcule qual será a cidade e a Casa 2 (ou Casa principal) do usuário naquele ano.
