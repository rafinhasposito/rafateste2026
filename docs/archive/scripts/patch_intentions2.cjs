const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetArray = `{[
            { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981" },
            { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#f59e0b" },
            { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e" },
            { id: "networking", icon: Users, label: "Networking", color: "#3b82f6" },
            { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7" },
            { id: "espiritual", icon: Sparkles, label: "Espiritualidade", color: "#818cf8" },
            { id: "identidade", icon: Crown, label: "Identidade", color: "#c9a227" },
          ].map((item, i) => (`;

const newArray = `{[
            { id: "amor", icon: Heart, label: "Amor e Relacionamento", color: "#f43f5e" },
            { id: "trabalho", icon: Briefcase, label: "Trabalho e Carreira", color: "#10b981" },
            { id: "dinheiro", icon: DollarSign, label: "Dinheiro e Recursos", color: "#f59e0b" },
            { id: "saude", icon: Leaf, label: "Saúde e Vitalidade", color: "#22c55e" },
            { id: "networking", icon: Users, label: "Networking", color: "#3b82f6" },
            { id: "rotina", icon: Calendar, label: "Rotina e Produtividade", color: "#a855f7" },
            { id: "espiritual", icon: Sparkles, label: "Espiritualidade", color: "#818cf8" },
            { id: "identidade", icon: Crown, label: "Identidade", color: "#c9a227" },
          ].filter(item => !item.label.includes(P.intention)).map((item, i) => (`;

content = content.replace(targetArray, newArray);
fs.writeFileSync(file, content);
