const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const search = `
</Reveal>
        </div>
      </section>
`;

const replace = `
            </div>
</Reveal>
        </div>
      </section>
`;

code = code.replace(search, replace);
fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
console.log("Fixed missing closing div before Reveal");
