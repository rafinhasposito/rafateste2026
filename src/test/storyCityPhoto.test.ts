import { describe, it, expect } from "vitest";
import { isAcceptableCityPhotoUrl } from "@/lib/storyCityPhoto";

describe("storyCityPhoto filtering", () => {
  it("rejeita bandeiras, brasões, mapas e SVGs", () => {
    expect(isAcceptableCityPhotoUrl("https://upload.wikimedia.org/Flag_of_Brazil.svg")).toBe(false);
    expect(isAcceptableCityPhotoUrl("https://upload.wikimedia.org/Brasao_Curitiba.png", 800, 800)).toBe(false);
    expect(isAcceptableCityPhotoUrl("https://upload.wikimedia.org/Location_map_Florianopolis.png", 900, 700)).toBe(false);
    expect(isAcceptableCityPhotoUrl("https://upload.wikimedia.org/photo.jpg", 300, 200)).toBe(false);
  });

  it("aceita fotos reais de alta resolução em proporção saudável", () => {
    expect(
      isAcceptableCityPhotoUrl(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Florianopolis_Bridge.jpg/1200px-Florianopolis_Bridge.jpg",
        1600,
        1066
      )
    ).toBe(true);
  });
});
