# Voyage Flow - Project Context

## Objetivo do Produto
Protocolo Solar (Voyage Flow) é uma plataforma premium de Astrologia de Relocalização (Astrocartografia e Revolução Solar). O objetivo é permitir que o usuário calcule as coordenadas geográficas ideais para passar o seu aniversário (Revolução Solar), com o intuito de ativar áreas específicas da sua vida (ex: prosperidade, relacionamento, carreira).

## Funcionalidades Principais
- **Consulta por Intenção:** O usuário descreve um desejo e o algoritmo sugere a casa astrológica correspondente.
- **Consulta por Casa:** O usuário seleciona uma casa diretamente no mapa astral.
- **Consulta por Cidade:** O usuário digita uma cidade e descobre qual casa ela ativa em seu mapa.
- **Sistema de Créditos:** A plataforma utiliza um modelo de monetização via créditos para liberar consultas, mapas e simulações.
- **Dashboard e Histórico:** O usuário pode visualizar relatórios gerados e gerenciar seus créditos.

## Arquitetura Atual
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion.
- **Backend/BaaS:** Supabase (PostgreSQL, Auth, RLS).
- **Gerenciamento de Estado:** React Query, Context API.
- **Roteamento:** React Router DOM.

## Decisões Importantes (Atuais)
- O projeto usa um "Starry Background" e temas cósmicos escuros.
- O componente `DestinyResults.tsx` age como o núcleo do sistema para renderizar resultados, mas atualmente apresenta alto acoplamento e será refatorado.
- Os textos (copy) e as informações das casas são fixos no frontend (ex: `src/lib/copy.ts`, `src/data/houses.ts`), mas precisarão ser reestruturados conforme as novas diretrizes do time de Produto.
