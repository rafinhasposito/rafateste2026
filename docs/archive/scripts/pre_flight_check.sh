#!/bin/bash
echo "🔒 Iniciando Trava Anti Tela Branca..."

# 1. Checagem estrita de TypeScript
echo "⏳ Verificando variáveis e imports (TypeScript)..."
npx tsc --noEmit -p tsconfig.app.json
if [ $? -ne 0 ]; then
    echo "❌ ERRO CRÍTICO: Variáveis indefinidas ou imports faltando."
    exit 1
fi

# 2. Verificação de build do Vite
echo "⏳ Simulando build de produção (Vite)..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ ERRO CRÍTICO: Falha na compilação do Vite. O app vai quebrar."
    exit 1
fi

echo "✅ SUCESSO: Código livre de telas brancas. Pronto para o usuário."
exit 0
