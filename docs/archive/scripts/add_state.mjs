import fs from 'fs';
const file = '/Volumes/SSD EXTERNO/PROJETO PROTOCOLO SOLAR - ONDE PASSAR SEU ANIVERSARIO/solar-release-candidate/src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `  const [openArea, setOpenArea] = useState<string>("dinheiro");`;

const replacement = `  const [openArea, setOpenArea] = useState<string>("dinheiro");
  const [isBoardingPassOpen, setIsBoardingPassOpen] = useState(false);
  const [openActs, setOpenActs] = useState<{[key: string]: boolean}>({ ato3: false, ato4: false });`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Success");
} else {
  console.log("Target not found");
}
