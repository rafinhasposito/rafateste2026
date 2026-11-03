const fs = require('fs');
let code = fs.readFileSync('src/pages/AppleResultPreview.tsx', 'utf8');

const searchRotas = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            { city: "São Paulo, SP", country: "Brasil", score: 96, tier: "Nacional", img: "https://images.unsplash.com/photo-1543059080-d2cfebdddf53?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Santiago", country: "Chile", score: 94, tier: "Acessível", img: "https://images.unsplash.com/photo-1518182170546-076616fdacdc?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Buenos Aires", country: "Argentina", score: 92, tier: "Acessível", img: "https://images.unsplash.com/photo-1613083163740-4284b3e6e87c?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Dubai", country: "Emirados Árabes", score: 98, tier: "High Ticket", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Tóquio", country: "Japão", score: 97, tier: "High Ticket", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" },
                            { city: "Singapura", country: "Singapura", score: 95, tier: "High Ticket", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=2000&auto=format&fit=crop" }
                          ].map((alt, i) => (`;

const replaceRotas = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[
                            ...(citiesObj.nacional || []).map(c => ({...c, tier: "Nacional"})),
                            ...(citiesObj.acessivel || []).map(c => ({...c, tier: "Acessível"})),
                            ...(citiesObj.highticket || []).map(c => ({...c, tier: "High Ticket"}))
                          ].slice(1) /* Pular a masterCity que já tá no topo */
                          .map((alt, i) => (`;

if (code.includes(searchRotas)) {
    code = code.replace(searchRotas, replaceRotas);
    // Also we need to fix the property names inside the map
    code = code.replace(/alt\.img/g, 'alt.image || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop"');
    code = code.replace(/alt\.city/g, '(alt.city || alt.display_name)');
    // But replacing alt.city directly might break the key or something.
    // Let's be careful.
    fs.writeFileSync('src/pages/AppleResultPreview.tsx', code);
    console.log("Rotas alternativas linked to API.");
} else {
    console.log("Could not find rotas mock data.");
}
