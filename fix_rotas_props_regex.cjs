const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const regex = /\{\[\s*\{ city: "São Paulo, SP"[\s\S]*?\}\s*\]\.map\(\(alt, i\) => \(/;

const replacement = `{\[
                            ...(citiesObj.nacional || []).map(c => ({...c, tier: "Nacional"})),
                            ...(citiesObj.acessivel || []).map(c => ({...c, tier: "Acessível"})),
                            ...(citiesObj.highticket || []).map(c => ({...c, tier: "High Ticket"}))
                          ].filter(c => (c.city || c.display_name) !== cityName).map((alt, i) => (`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    // Replace alt.img with a safe fallback
    code = code.replace(/alt\.img/g, 'alt.image || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop"');
    code = code.replace(/alt\.city/g, '(alt.city || alt.display_name)');
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Rotas alternativas linked to API via regex.");
} else {
    console.log("Could not match the array via regex.");
}
