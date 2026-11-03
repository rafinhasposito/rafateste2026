const fs = require('fs');

function addSearchPath(file, pathVal) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<DestinyResults') && !content.includes('searchPath=')) {
    content = content.replace(
      '<DestinyResults',
      `<DestinyResults\n            searchPath="${pathVal}"`
    );
    fs.writeFileSync(file, content);
    console.log("Updated " + file);
  }
}

addSearchPath('src/components/HouseLookup.tsx', 'casa');
addSearchPath('src/components/CityLookup.tsx', 'cidade');
addSearchPath('src/components/IntentLookup.tsx', 'intencao');

// Also check Dashboard.tsx for HouseDetail which wraps DestinyResults
