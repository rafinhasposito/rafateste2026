const fs = require('fs');
const file = 'src/layouts/MobileAppChrome.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHeader = `if (!session) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-5 pt-8 pb-4 flex items-center justify-between pointer-events-none">
        <img
          src="/brand/protocolo-solar-logo-horizontal.svg"
          alt="Protocolo Solar"
          className="w-[280px] h-auto pointer-events-auto opacity-95 drop-shadow-md"
          draggable={false}
        />
      </header>
    );
  }`;

const newHeader = `if (!session) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-5 pt-8 pb-4 flex items-center justify-between pointer-events-none">
        <Link to="/" className="pointer-events-auto">
          <img
            src="/brand/protocolo-solar-logo-horizontal.svg"
            alt="Protocolo Solar"
            className="w-[200px] h-auto opacity-95 drop-shadow-md"
            draggable={false}
          />
        </Link>
        <Link 
          to="/tecnologia" 
          className="pointer-events-auto text-[10px] uppercase tracking-widest text-brand-primary border border-brand-primary/20 bg-brand-primary/10 px-3 py-1.5 rounded-full backdrop-blur-md"
        >
          Tecnologia
        </Link>
      </header>
    );
  }`;

content = content.replace(oldHeader, newHeader);
fs.writeFileSync(file, content);
console.log("Technology link added to Mobile navigation.");
