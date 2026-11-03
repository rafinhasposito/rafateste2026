const fs = require('fs');
const file = 'src/layouts/DesktopWebChrome.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the condition `{session && (` with an always-visible nav, but change what's inside based on session.
const oldNav = `{session && (
            <nav className="flex items-center gap-6">
              <Link 
                to="/" 
                className="text-sm font-sans font-medium text-foundation-muted-fg hover:text-foundation-fg transition-colors"
              >
                Nova Consulta
              </Link>
              <Link 
                to="/history" 
                className="text-sm font-sans font-medium text-foundation-muted-fg hover:text-foundation-fg transition-colors"
              >
                Consultas Anteriores
              </Link>
            </nav>
          )}`;

const newNav = `<nav className="flex items-center gap-6">
              <Link 
                to="/tecnologia" 
                className="text-sm font-sans font-medium text-brand-primary/80 hover:text-brand-primary transition-colors flex items-center gap-1"
              >
                Como Funciona
              </Link>
              {session && (
                <>
                  <Link 
                    to="/" 
                    className="text-sm font-sans font-medium text-foundation-muted-fg hover:text-foundation-fg transition-colors"
                  >
                    Nova Consulta
                  </Link>
                  <Link 
                    to="/history" 
                    className="text-sm font-sans font-medium text-foundation-muted-fg hover:text-foundation-fg transition-colors"
                  >
                    Consultas Anteriores
                  </Link>
                </>
              )}
            </nav>`;

content = content.replace(oldNav, newNav);
fs.writeFileSync(file, content);
console.log("Technology link added to Desktop navigation.");
