const fs = require('fs');
const file = 'src/pages/AppleResultPreviewV4.tsx';
let content = fs.readFileSync(file, 'utf8');

// Fix Image in DNA block
content = content.replace(
  '<img src={currentActiveData.image} alt={currentActiveData.city} className="w-full h-full object-cover opacity-90 transition-all duration-1000" />',
  '<img src={dynamicHouseImg} alt={dynamicCity.split(",")[0]} className="w-full h-full object-cover opacity-90 transition-all duration-1000" />'
);

// Also check the Grid Image just in case!
content = content.replace(
  '<img src={isCurrent ? currentActiveData.image : imageForThisHouse} alt={cityForThisHouse} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />',
  '<img src={isCurrent ? dynamicHouseImg : imageForThisHouse} alt={cityForThisHouse} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />'
);

fs.writeFileSync(file, content);
fs.writeFileSync('src/pages/AppleResultPreviewV5.tsx', content);

console.log("Fixed image mismatch where Casa 11 would show Dubai's image!");
