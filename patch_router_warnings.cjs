const fs = require('fs');
const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldRouter = "<BrowserRouter>";
const newRouter = `<BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >`;

content = content.replace(oldRouter, newRouter);

fs.writeFileSync(file, content);
console.log("Patched BrowserRouter future flags.");
