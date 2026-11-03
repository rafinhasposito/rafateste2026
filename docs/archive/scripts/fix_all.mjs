import fs from 'fs';
const file = '/Volumes/SSD EXTERNO/PROJETO PROTOCOLO SOLAR - ONDE PASSAR SEU ANIVERSARIO/solar-release-candidate/src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

// The easiest way to fix this is to extract the content, compile it through a parser, or just use regex to remove the extra closing tags until it matches.
// I will just remove ONE </div> right before </Reveal> again!
