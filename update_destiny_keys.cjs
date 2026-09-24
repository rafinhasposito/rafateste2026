const fs = require('fs');
const file = 'src/components/DestinyResults.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/houseDataFull\.podeFavorecer/g, 'houseDataFull.benefits');
content = content.replace(/Pode Favorecer/g, 'Benefícios');

content = content.replace(/houseDataFull\.idealPara/g, 'houseDataFull.forWho');
content = content.replace(/Ideal Para/g, 'Para Quem É');

content = content.replace(/houseDataFull\.comoAproveitar/g, 'houseDataFull.realLifeImpact');

fs.writeFileSync(file, content);
console.log("DestinyResults keys updated to match prompt structure.");
