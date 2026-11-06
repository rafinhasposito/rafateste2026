import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UniverseJourney } from "../components/onboarding-v2/UniverseJourney";

vi.mock("../components/onboarding-v2/OrbitSky", () => ({ OrbitSky: () => null }));

let scrollPosition = 0;
const scrollTo = vi.fn((options: ScrollToOptions) => {
  scrollPosition = options.top || 0;
  fireEvent.scroll(window);
});

describe("Jornada do Universo às Casas", () => {
  beforeEach(() => {
    scrollPosition = 0;
    scrollTo.mockClear();
    vi.stubGlobal("innerHeight", 800);
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
    vi.spyOn(window, "scrollY", "get").mockImplementation(() => scrollPosition);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(() => ({
      x: 0, y: -scrollPosition, top: -scrollPosition, left: 0, width: 1280, height: 2400,
      bottom: 2400 - scrollPosition, right: 1280, toJSON() {},
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("permite percorrer os três momentos sem animação e abrir a prévia", async () => {
    const complete = vi.fn();
    render(<UniverseJourney playing={false} reduced onComplete={complete} />);
    fireEvent.click(screen.getByRole("button", { name: "EXPLORAR AS CASAS" }));
    expect(await screen.findByRole("heading", { name: /12 Casas/ })).toBeVisible();
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: "instant" }));
    expect(screen.queryByRole("heading", { name: /O Universo/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "VER CASA EM DESTAQUE" }));
    expect(await screen.findByRole("heading", { name: /Muda a Casa/ })).toBeVisible();
    expect(complete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "VER A PRÉVIA EM ROMA" }));
    expect(complete).toHaveBeenCalledOnce();
  });

  it("acompanha a rolagem nos dois sentidos sem avançar de tela automaticamente", async () => {
    const complete = vi.fn();
    render(<UniverseJourney playing reduced={false} onComplete={complete} />);
    scrollPosition = 1600;
    fireEvent.scroll(window);
    expect(await screen.findByRole("heading", { name: /Muda a Casa/ })).toBeVisible();
    scrollPosition = 0;
    fireEvent.scroll(window);
    expect(await screen.findByRole("heading", { name: /O Universo/ })).toBeVisible();
    expect(screen.getByRole("button", { name: "1. O Universo" })).toHaveAttribute("aria-current", "step");
    expect(complete).not.toHaveBeenCalled();
  });
});
