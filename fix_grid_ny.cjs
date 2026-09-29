const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

// The active house in the mock is currently idx === 1 (Casa 2).
// I will change it so the active house is Casa 10 (Fama & Carreira) and the city is Nova York.

const searchGrid = `const isCurrent = idx + 1 === 2; // Mock: Casa 2 is the active one`;
const replaceGrid = `const isCurrent = idx + 1 === 10; // Mock: Casa 10 is the active um`;

const searchCity = `const mockCities = [
                              "Innsbruck", "Madrid", "Mumbai", "Quioto", "Bali", "Sydney", "Auckland", "Bora Bora", "Cidade do México", "Dallas", "Florianópolis", "Ponta Delgada"
                            ];`;
const replaceCity = `const mockCities = [
                              "Innsbruck", "Madrid", "Mumbai", "Quioto", "Bali", "Sydney", "Auckland", "Bora Bora", "Cidade do México", "Nova York", "Florianópolis", "Ponta Delgada"
                            ];`;

if (code.includes(searchGrid) && code.includes(searchCity)) {
    code = code.replace(searchGrid, replaceGrid);
    code = code.replace(searchCity, replaceCity);
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Mock grid updated to align with NY.");
} else {
    console.log("Could not find the grid mock data to replace.");
}
