const fs = require('fs');
const file = 'src/pages/AppleResultPrototype.tsx';
let content = fs.readFileSync(file, 'utf8');

const injection = `
  // DEBUG HELPER
  React.useEffect(() => {
    const handleErr = (msg, url, line, col, error) => {
      alert("RUNTIME ERROR: " + msg + " line: " + line);
    };
    window.addEventListener("error", handleErr);
    return () => window.removeEventListener("error", handleErr);
  }, []);
`;

if (!content.includes('DEBUG HELPER')) {
  content = content.replace('const [showSummary', injection + '\n  const [showSummary');
  fs.writeFileSync(file, content);
  console.log("Injected error alert helper!");
}
