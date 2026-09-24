const fs = require('fs');

const files = [
    {
        name: 'src/pages/History.tsx',
        replacements: [
            {
                // Match the motion.button block containing "Voltar ao Descobrir"
                regex: /<motion\.button[^>]*>[\s\S]*?Voltar ao Descobrir[\s\S]*?<\/motion\.button>/,
                replacement: '<BackButton label="Descobrir" to="/" className="mb-8" />'
            }
        ]
    },
    {
        name: 'src/pages/Profile.tsx',
        replacements: [
            {
                // Match the motion.button block containing "{returnTo ? "Voltar" : "Início"}"
                regex: /<motion\.button[^>]*>[\s\S]*?\{returnTo \? "Voltar" : "Início"\}[\s\S]*?<\/motion\.button>/,
                replacement: '<BackButton label={returnTo ? "Voltar" : "Início"} to={returnTo || "/"} />'
            }
        ]
    },
    {
        name: 'src/pages/Credits.tsx',
        replacements: [
            {
                // Match the button block containing "Voltar ao Descobrir"
                regex: /<button[^>]*>[\s\S]*?Voltar ao Descobrir[\s\S]*?<\/button>/,
                replacement: '<BackButton label="Descobrir" to="/" className="mb-8 mx-auto" />'
            }
        ]
    },
    {
        name: 'src/pages/Auth.tsx',
        replacements: [
            {
                regex: /<button onClick=\{\(\) => setMode\("signin"\)\}.*?>← Voltar ao login<\/button>/,
                replacement: '<BackButton label="Voltar ao login" onClick={() => setMode("signin")} />'
            }
        ]
    }
];

files.forEach(f => {
    if (fs.existsSync(f.name)) {
        let content = fs.readFileSync(f.name, 'utf8');
        let changed = false;

        // Ensure BackButton is imported if not already
        if (!content.includes('BackButton')) {
            // Find a good place to insert the import
            if (content.includes('import { motion')) {
                content = content.replace('import { motion', "import { BackButton } from '@/components/ui/BackButton';\nimport { motion");
            } else if (content.includes('import { ArrowLeft')) {
                content = content.replace('import { ArrowLeft', "import { BackButton } from '@/components/ui/BackButton';\nimport { ArrowLeft");
            } else {
                content = "import { BackButton } from '@/components/ui/BackButton';\n" + content;
            }
        }

        f.replacements.forEach(r => {
            if (r.regex.test(content)) {
                content = content.replace(r.regex, r.replacement);
                changed = true;
            } else {
                console.warn(`Regex failed to match in ${f.name}:`, r.regex);
            }
        });

        if (changed) {
            fs.writeFileSync(f.name, content);
            console.log(`Patched ${f.name}`);
        }
    }
});
