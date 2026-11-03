const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreviewV3.tsx', 'utf8');

// The error is because we inserted siblings to the top-level <div> inside the map without a Fragment.
// Let's replace the top of the map:
// From: .map((currentActiveData) => (
// To: .map((currentActiveData) => ( <React.Fragment key={currentActiveData.id}>

code = code.replace(
    /map\(\(currentActiveData\) => \(\n\s*<div key=\{currentActiveData.id\}/,
    "map((currentActiveData) => (\n<React.Fragment key={currentActiveData.id}>\n<div"
);

// And close it at the very bottom where we placed )}
// From:                  )}
// To:                  </React.Fragment>)}
code = code.replace(
    /                  \)}\n               <\/div>\n            <\/div>/,
    "                  </React.Fragment>\n                  )}\n               </div>\n            </div>"
);

fs.writeFileSync('src/pages/AppleResultPreviewV3.tsx', code);
console.log("JSX fixed.");
