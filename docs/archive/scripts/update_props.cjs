const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const importDestinyResultsProps = `import { DestinyResultsProps } from "@/components/DestinyResults";\nimport { useAuth } from "@/hooks/useAuth";\nimport { cityDatabase } from "@/data/houses";`;

if (!code.includes('DestinyResultsProps')) {
    code = code.replace('import React, { useRef, useState } from "react";', `import React, { useRef, useState, useEffect } from "react";\n${importDestinyResultsProps}`);
}

const componentDefOld = `export default function AppleResultPreview() {`;
const componentDefNew = `export default function AppleResultPreview(props: DestinyResultsProps) {
  const { profile } = useAuth();
  
  // Mapeamento dos Dados da API
  const houseNum = props.house || 2;
  const houseData = props.houseData || cityDatabase[houseNum];
  const allResults = props.allResults || {};
  const citiesObj = props.cities || {};
  const userCredits = props.userCredits || 0;
  
  // Cidade Principal (Destino Mestre)
  const masterCity = citiesObj.acessivel?.[0] || citiesObj.nacional?.[0] || citiesObj.highticket?.[0];
  const cityName = masterCity?.city || masterCity?.display_name || "Nova Iorque";
  const countryName = masterCity?.country || "EUA";
  const matchScore = masterCity?.score || 98;
  
  // Boarding Pass Data
  const userName = profile?.full_name?.split(" ")[0] || "Viajante";
  const userFullName = profile?.full_name || "Viajante Solar";
  const birthDate = profile?.birth_date || "1985-08-09";
  const birthTime = profile?.birth_time ? String(profile.birth_time).slice(0, 5) : "05:30";
  const originCity = profile?.birth_city?.split(',')[0] || "Surubim";
  const currentYear = new Date().getFullYear();
  const targetYear = props.mode === "futuro" ? currentYear + 1 : currentYear;
  const returnDate = \`\${birthDate.split("-")[2]}/\${birthDate.split("-")[1]}/\${targetYear}\`;
  const consultationHash = props.consultationId?.split('-')[0].toUpperCase() || 'RS-9928X';
  const sign = profile?.sun_sign || "Leão";
  const ascendant = profile?.rising_sign || "Virgem";
  const intention = props.searchPath ? String(props.searchPath).toUpperCase() : "FOCO";
`;

if (code.includes(componentDefOld)) {
    code = code.replace(componentDefOld, componentDefNew);
    
    // Now replace the hardcoded 'P' constants usage with our dynamic variables.
    // Replace P.name -> userFullName
    // Replace P.firstName -> userName
    // Replace P.origin -> originCity
    // Replace P.match -> matchScore
    // Replace P.hash -> consultationHash
    // Replace P.sign -> sign
    // Replace P.intention -> intention
    
    code = code.replace(/P\.name/g, 'userFullName');
    code = code.replace(/P\.firstName/g, 'userName');
    code = code.replace(/P\.origin/g, 'originCity');
    code = code.replace(/P\.match/g, 'matchScore');
    code = code.replace(/P\.hash/g, 'consultationHash');
    code = code.replace(/P\.sign/g, 'sign');
    code = code.replace(/P\.intention/g, 'intention');
    
    // Replace hardcoded "Nova Iorque" / "Nova York, EUA" with dynamic city
    code = code.replace(/"Nova York, EUA"/g, '`${cityName}, ${countryName}`');
    
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Props mapped in AppleResultPreview.");
} else {
    console.log("Component definition not found or already modified.");
}
