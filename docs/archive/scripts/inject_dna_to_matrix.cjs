const fs = require('fs');

const dnaDB = JSON.parse(fs.readFileSync('dna_parsed.json', 'utf-8'));
let matrixContent = fs.readFileSync('src/data/focusMatrix.ts', 'utf-8');

// The file is a TS module exporting FOCUS_MATRIX.
// We will use eval to load it, modify the object, and write it back.
// Since it's TS, it might fail if there are typings.
// Actually, let's just do a string replacement approach or a regex approach.
// But wait, focusMatrix.ts is huge.
// Let's create a NEW file `src/data/dnaMatrix.ts` and import it in AppleResultPreviewV3!
// This is much cleaner and safer than mutating a 3000-line TS string.

const dnaTsCode = `// Gerado automaticamente via NotebookLM e Script Parser
export const DNA_MATRIX: Record<number, Record<string, { essencia: string; metodo: string; fase: string }>> = ${JSON.stringify(dnaDB, null, 2)};
`;

fs.writeFileSync('src/data/dnaMatrix.ts', dnaTsCode);
