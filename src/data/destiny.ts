export interface DestinyData {
  id: string;
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  context: {
    imageUrl: string;
    description: string;
    source: string;
    sourceUrl: string;
  };
}

export const mockDestinyNewYork: DestinyData = {
  id: "nyc",
  name: "New York",
  country: "United States",
  coordinates: { lat: 40.71, lng: -74.01 },
  weather: {
    temp: 24,
    condition: "nublado",
    icon: "https://openweathermap.org/img/wn/04d.png",
  },
  context: {
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&q=80",
    description: "Nova Iorque, oficialmente Cidade de Nova Iorque, é a cidade mais populosa dos Estados Unidos; sua região metropolitana é uma das áreas metropolitanas mais populosas do mundo. É também a terceira cidade mais populosa da América. Localizada no estado de Nova Iorque, exerce impacto significativo sobre comércio, finanças, mídia, arte, moda, pesquisa, tecnologia, educação e entretenimento em todo o mundo.",
    source: "Wikipedia",
    sourceUrl: "https://pt.wikipedia.org/wiki/Nova_Iorque",
  },
};
