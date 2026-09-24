const fs = require('fs');
const file = 'src/pages/History.tsx';
let content = fs.readFileSync(file, 'utf8');

if(!content.includes("BackButton")) {
    content = content.replace(
        "import { ArrowLeft",
        "import { BackButton } from '@/components/ui/BackButton';\nimport { ArrowLeft"
    );

    const oldButton = `<button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Descobrir
          </button>`;
        
    content = content.replace(oldButton, `<BackButton label="Descobrir" to="/" />`);
    fs.writeFileSync(file, content);
}
