const { FOCUS_MATRIX } = require('./src/data/focusMatrix.ts');

const LIFE_AREAS = [
  { id: "dinheiro", score: 98 }, 
  { id: "trabalho", score: 88 }, 
  { id: "identidade", score: 80 }, 
  { id: "rotina", score: 72 }, 
  { id: "networking", score: 65 }, 
  { id: "amor", score: 62 }, 
  { id: "espiritual", score: 55 }, 
  { id: "saude", score: 52 }
];

const baseHouseId = "4";
const currentHouseProfiles = FOCUS_MATRIX[baseHouseId] || {};

const mergedAreas = LIFE_AREAS.map(area => {
  const focusData = currentHouseProfiles[area.id];
  if (!focusData) return area;
  return {
    ...area,
    score: focusData.match || area.score,
  };
});

const sortedAreas = [...mergedAreas].sort((a,b) => b.score - a.score);
console.log("Casa 4 winner:", sortedAreas[0].id);

const baseHouseId2 = "1";
const currentHouseProfiles2 = FOCUS_MATRIX[baseHouseId2] || {};

const mergedAreas2 = LIFE_AREAS.map(area => {
  const focusData = currentHouseProfiles2[area.id];
  if (!focusData) return area;
  return {
    ...area,
    score: focusData.match || area.score,
  };
});

const sortedAreas2 = [...mergedAreas2].sort((a,b) => b.score - a.score);
console.log("Casa 1 winner:", sortedAreas2[0].id);
