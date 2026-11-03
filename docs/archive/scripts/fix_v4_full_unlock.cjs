const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldElseBlock = `            if (targetLockedArea?.type === 'foco') {
              setHoveredArea(id);
            }
          }
        }}
        targetArea={targetLockedArea}`;

const newElseBlock = `            if (targetLockedArea?.type === 'foco') {
              setHoveredArea(id);
            } else if (targetLockedArea?.type === 'rota') {
              setActiveRouteIndex(parseInt(id) - 1);
              setHoveredArea(ROUTES_MOCK_DATA[parseInt(id) - 1].focusId);
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
            }
          }
        }}
        targetArea={targetLockedArea}`;

content = content.replace(oldElseBlock, newElseBlock);

fs.writeFileSync(file, content);
console.log("Fixed Full Unlock Gamification!");
