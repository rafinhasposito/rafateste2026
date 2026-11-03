const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to import useSearchParams
content = content.replace(
  'import { useState, useRef, useEffect } from "react";',
  'import { useState, useRef, useEffect } from "react";\nimport { useSearchParams } from "react-router-dom";'
);

// We need to initialize activeRouteIndex from the query parameter
content = content.replace(
  'const [activeRouteIndex, setActiveRouteIndex] = useState(1); // Default Casa 2',
  `const [searchParams] = useSearchParams();
  const initialHouse = searchParams.get('house') ? parseInt(searchParams.get('house')) - 1 : 1;
  const [activeRouteIndex, setActiveRouteIndex] = useState(initialHouse >= 0 && initialHouse <= 11 ? initialHouse : 1); // Default Casa 2 ou via URL`
);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Added query parameter support for direct testing!");
