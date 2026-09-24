const fs = require('fs');
const file = 'src/components/HouseDetail.tsx';
let content = fs.readFileSync(file, 'utf8');

if (content.includes('<DestinyResults') && !content.includes('searchPath=')) {
  // we might not know searchPath in History unless we save it, but we can just pass null or not pass it.
  console.log("No need to update HouseDetail for now, it will just omit the badge which is fine for history.");
}
