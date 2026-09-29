const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const search = `
            </div>
</Reveal>
`;

const replace = `
            </div>
            </div>
</Reveal>
`;

code = code.replace(search, replace);
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
