const fs = require('fs');
const file = 'src/pages/Technology.tsx';
let content = fs.readFileSync(file, 'utf8');

if(!content.includes("BackButton")) {
    content = content.replace(
        "import { Accordion",
        "import { BackButton } from '@/components/ui/BackButton';\nimport { Accordion"
    );

    const oldButton = `<button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-white/50 hover:text-white transition-all duration-300 w-fit backdrop-blur-md bg-white/5 border border-white/10 px-4 py-2 rounded-full"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-[0.2em]">Retornar</span>
        </button>`;
        
    content = content.replace(oldButton, `<BackButton />`);
    fs.writeFileSync(file, content);
}
