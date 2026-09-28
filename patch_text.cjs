const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetRegex = /<motion\.div style=\{\{ opacity: textOpacity \}\} className="flex flex-col items-center max-w-2xl text-center">[\s\S]*?<\/motion\.div>/;

const replacement = `<motion.div style={{ opacity: textOpacity }} className="flex flex-col items-center max-w-4xl text-center px-4 mt-2">
           <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/90 leading-[1.4] md:leading-[1.3] tracking-tight">
             O destino exato para ativar a Casa que multiplica o seu poder de conexão e coloca{" "}
             <span className="text-[#3b82f6] font-medium block mt-1 md:inline md:mt-0">grupos, amizades e internet a serviço dos seus resultados.</span>
           </p>
        </motion.div>`;

content = content.replace(targetRegex, replacement);

fs.writeFileSync(file, content);
console.log("Success!");
