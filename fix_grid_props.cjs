const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const searchGrid = `{Array.from({ length: 12 }).map((_, idx) => {
                            const isCurrent = idx + 1 === 2; // Mock: Casa 2 is the active um
                            const houseNum = idx + 1;`;
                            
const replaceGrid = `{Array.from({ length: 12 }).map((_, idx) => {
                            const houseNum = idx + 1;
                            const isCurrent = houseNum === houseNum; // Replaced to use API data below`;
                            
if (code.includes(searchGrid)) {
    // Actually, let's do a more robust regex replacement for the grid logic
    let newCode = code.replace(
      /{Array\.from\(\{ length: 12 \}\)\.map\(\(_, idx\) => \{[\s\S]*?const mockCities = \[[^\]]*\];/m,
      `{Array.from({ length: 12 }).map((_, idx) => {
                            const houseNum = idx + 1;
                            const isCurrent = houseNum === houseNum /* We use houseNum from props */;
                            const houseLabels = [
                              "Ação & Magnetismo", "Dinheiro & Bens", "Vendas & Contatos", "Lar & Imóveis",
                              "Romances & Sorte", "Saúde & Eficiência", "Casamento & Sociedades", "Heranças & Poder",
                              "Viagens & Estudos", "Fama & Carreira", "Networking & Apoio VIP", "Bastidores & Intuição"
                            ];
                            const isActualCurrent = houseNum === props.house;
                            const resultData = allResults[houseNum];
                            const cityForThisHouse = isActualCurrent ? cityName : (resultData?.city?.display_name || "Trancado");
                            `
    );
    
    // Replace the isCurrent references inside the loop with isActualCurrent
    newCode = newCode.replace(/!isCurrent/g, '!isActualCurrent');
    newCode = newCode.replace(/isCurrent \?/g, 'isActualCurrent ?');
    newCode = newCode.replace(/isCurrent/g, 'isActualCurrent'); // Any remaining
    
    // Replace the hardcoded mockCities[idx] with cityForThisHouse
    newCode = newCode.replace(/mockCities\[idx\]/g, 'cityForThisHouse');
    
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', newCode);
    console.log("Grid now uses API data.");
} else {
    console.log("Could not find grid loop.");
}
