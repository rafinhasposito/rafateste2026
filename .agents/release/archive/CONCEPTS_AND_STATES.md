# CONCEITOS E ESTADOS DO PROTOCOLO SOLAR (V3/V4)

Este documento foi criado para registrar permanentemente as regras de negócio e como a interface reage a elas, para evitar qualquer desvio no futuro.

## 1. Glossário Absoluto
* **FOCO / INTENÇÃO:** São as áreas da vida que o usuário deseja melhorar (Ex: Dinheiro, Amor, Saúde). Elas aparecem no Accordion lateral. O usuário não "viaja" para um Foco, ele viaja para uma Cidade que atende àquele Foco.
* **ROTA / CIDADE / CASA:** São os destinos geográficos e astrológicos (As 12 Casas). O usuário "Desbloqueia uma Rota" para ver qual cidade corresponde àquela Casa.
* **O Erro Anterior:** O Modal de Paywall tratava "Foco" como "Rota". Isso estava conceitualmente errado. Agora, o sistema sabe diferenciar se o usuário clicou num Foco (menu lateral) ou numa Rota (grade inferior) e adapta os textos do Paywall ("Desbloquear Intenção" vs "Desbloquear Rota").

## 2. Estado Efêmero de Desbloqueio (Mock)
* Na V3 atual, o banco de dados não está conectado. Portanto, quando o usuário clica em "Comprar/Desbloquear" no modal, o sistema adiciona o ID do Foco ou da Rota a uma lista temporária na memória (`unlockedItems`).
* Isso faz com que o componente seja re-renderizado instantaneamente, o cadeado (Lock) seja substituído pelo ícone de Destrancado (Unlock), e a área seja liberada para clique normal.
* Na V4, essa lista `unlockedItems` virá do banco de dados (Propriedades do Perfil do Usuário).

## 3. Estética das Imagens
* Foi abandonado o filtro "Luminosity" (Preto e Branco) e a opacidade em 30% que escondia as fotos.
* As fotos agora têm 80% de visibilidade e um gradiente suave apenas na base para dar leitura ao texto, respeitando a estética premium da Apple sem destruir a clareza visual da cidade.
