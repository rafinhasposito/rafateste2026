const fs = require('fs');

const files = [
  'src/components/CityLookup.tsx',
  'src/components/HouseLookup.tsx',
  'src/components/IntentLookup.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Make sure useNavigate is used.
    // Replace <DestinyResults with <DestinyResults onUnlock={(n) => navigate(`/dashboard?id=${result.consultationId}&unlock=${n}`)}
    if (!content.includes('onUnlock={(n) => navigate')) {
      content = content.replace(
        /<DestinyResults/g,
        '<DestinyResults\n              onUnlock={(n) => navigate(`/dashboard?id=${result.consultationId}&unlock=${n}`)}'
      );
      fs.writeFileSync(file, content);
      console.log(`Patched ${file}`);
    }
  }
});
