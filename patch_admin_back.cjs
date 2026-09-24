const fs = require('fs');
const file = 'src/pages/Admin.tsx';
let content = fs.readFileSync(file, 'utf8');

if(!content.includes("BackButton")) {
    content = content.replace(
        "import { Users",
        "import { BackButton } from '@/components/ui/BackButton';\nimport { Users"
    );

    const oldButton1 = `<button onClick={() => navigate("/")} className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-xs uppercase tracking-widest">← Voltar</button>`;
    content = content.replace(oldButton1, `<BackButton label="Voltar" to="/" />`);

    const oldButton2 = `<button onClick={() => navigate("/")} className="text-muted-foreground text-xs uppercase tracking-widest hover:text-primary mb-6 inline-block">← Voltar</button>`;
    content = content.replace(oldButton2, `<BackButton label="Voltar" to="/" className="mb-6" />`);
    
    fs.writeFileSync(file, content);
}
