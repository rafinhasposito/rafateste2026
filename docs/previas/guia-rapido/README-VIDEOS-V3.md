# Guia da Pasta V3 — Vídeos & Substituição Fácil

Esta pasta controla a página **[onboarding-v3.html](./onboarding-v3.html)**.

> [!IMPORTANT]
> **Não mova o arquivo `onboarding-v3.html` para outra pasta.**
> Ele usa caminhos relativos (`../../../public/...` e `../../../index.html`) para carregar fontes, vídeos de cidades no passo de data e abrir o app principal ao final.

---

## Como substituir seus vídeos colorizados (jeito mais rápido)

Salve ou substitua os arquivos **`.mp4`** diretamente dentro da pasta **`assets-v3/`** usando **exatamente** os nomes numerados abaixo. Não precisa editar código.

| Ordem | Tela / Stage | Arquivo `.mp4` em `assets-v3/` | Capa (`.jpg`) opcional em `assets-v3/` | Observação prática |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Stage 0** · Abertura do Theo | `01-abertura.mp4` | `01-abertura-poster.jpg` | Toca inteiro (**8,04s**, `cutAtSeconds: null`) sem fade do preto e avança para a Terra (*"Tem anos bons e anos difíceis..."*) |
| **2** | **Stage 1** · Terra Orbital (Nascer do Sol) | `02-terra-sunrise.mp4` | `02-terra-sunrise-poster.jpg` | Toca em loop mudo ao fundo enquanto apresenta a proposta e avança direto para a pergunta do nome (**Stage 3**) |
| **3** | **Stage 2** · Transições Entre Cidades *(bypass ativo)* | `03-transicoes-cidades.mp4` | `03-transicoes-cidades-poster.jpg` | Preservado em `assets-v3/`, porém pulado no fluxo atual (**Stage 1 → Stage 3**) para não antecipar as cidades antes do **Stage 5** |
| **4** | **Stage 3** · Theo Pergunta o Nome | `04-pergunta-nome.mp4` | `04-pergunta-nome-poster.jpg` | Fala uma vez e pausa com leve respiração no último frame esperando o usuário digitar |
| **5** | **Stage 5** · Vídeo Principal das Cidades | `05-master-cidades.mp4` | `05-master-cidades-poster.jpg` | Vídeo editorial sem botões no meio; ao terminar, avança para as 3 Prioridades |

---

## Estrutura organizada da pasta

- `onboarding-v3.html` — Prévia oficial da V3
- `assets-v3/` — Contém **apenas** os 5 vídeos numerados (`01-` a `05-`), suas capas `-poster.jpg`, o guia rápido `00-LEIA-ME-NOMES-DOS-VIDEOS.txt` e `_backup-originais/`
- `abertura-com-voz.html` e `guia-pessoal.html` — Referências da V2 mantidas intactas
- Protótipos e versões descartadas antigas foram movidos para `../../../../03-HTMLS-E-PROTOTIPOS/` na raiz do projeto

---

## Backup antes de sobrescrever

Antes de colar uma nova versão por cima do `.mp4` atual, arraste o arquivo antigo para:

`assets-v3/_backup-originais/`

---

## Se preferir usar novos nomes de arquivo

Caso queira exportar com outros nomes (ex.: `01-abertura-cor-nova.mp4`), coloque o arquivo dentro de `assets-v3/` e atualize o bloco `V3_MEDIA` dentro de `onboarding-v3.html` (linhas ~1392–1414).

## Biblioteca geral de todos os vídeos do projeto

Para pesquisar outros vídeos salvos no projeto (Theo viajando, cenas por Casa astrológica, Terra/espaço em 4K, 48 cidades e depoimentos), consulte [CATALOGO-DE-VIDEOS.md](../../../../01-VIDEOS/CATALOGO-DE-VIDEOS.md) dentro de `01-VIDEOS/` na raiz do projeto.
