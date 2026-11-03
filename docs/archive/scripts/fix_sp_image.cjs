const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const wrongImage = 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2000&auto=format&fit=crop';
const correctSPImage = 'https://images.unsplash.com/photo-1543059080-d2cfebdddf53?q=80&w=2000&auto=format&fit=crop';

if (code.includes(wrongImage)) {
    code = code.replace(wrongImage, correctSPImage);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Fixed SP image.");
} else {
    console.log("Could not find the wrong image.");
}
