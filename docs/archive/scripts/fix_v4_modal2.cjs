const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `            if (targetLockedArea?.type === 'foco') {
              setHoveredArea(id);
            }`;

const replacement = `            if (targetLockedArea?.type === 'foco') {
              setHoveredArea(id);
            } else if (targetLockedArea?.type === 'rota') {
              setActiveRouteIndex(parseInt(id) - 1);
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
            }`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
