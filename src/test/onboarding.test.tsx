import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { MobileOnboarding, ONBOARDING_SCREENS } from "../components/mobile/onboarding/MobileOnboarding";

describe("MobileOnboarding 6 Screens Flow", () => {
  it("has exactly 6 approved screens configured", () => {
    expect(ONBOARDING_SCREENS).toHaveLength(6);
  });

  it("renders screen 1 with Protocolo Solar branding, title and CTA button", () => {
    render(
      <BrowserRouter>
        <MobileOnboarding />
      </BrowserRouter>
    );

    // Header checks
    expect(screen.getByText(/PROTOCOLO SOLAR/i)).toBeDefined();
    expect(screen.getByText("01/06")).toBeDefined();

    // CTA & Privacy Lock
    expect(screen.getByText(/Iniciar Exploração/i)).toBeDefined();
  });

  it("navigates forward through all 6 screens via next button and progress indicators", () => {
    render(
      <BrowserRouter>
        <MobileOnboarding />
      </BrowserRouter>
    );

    // Step 1
    expect(screen.getByText("01/06")).toBeDefined();
    const btnScreen1 = screen.getByText(/Iniciar Exploração/i);
    
    // Step 1 -> 2
    fireEvent.click(btnScreen1);
    expect(screen.getByText("2/6")).toBeDefined();

    // From Screen 2 onwards, we have the old Footer
    const nextBtn = screen.getByLabelText(/Próxima tela/i);

    // Step 2 -> 3
    fireEvent.click(nextBtn);
    expect(screen.getByText("3/6")).toBeDefined();
    expect(screen.getByText(/12 CASAS/i)).toBeDefined();
    expect(screen.getAllByText(/PLANETAS/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/NOVOS CENÁRIOS/i)).toBeDefined();
    expect(screen.getByText(/ESCOLHAS/i)).toBeDefined();

    // Step 3 -> 4
    fireEvent.click(nextBtn);
    expect(screen.getByText("4/6")).toBeDefined();
    expect(screen.getByText(/SÃO PAULO/i)).toBeDefined();
    expect(screen.getByText(/NOVA YORK/i)).toBeDefined();

    // Step 4 -> 5
    fireEvent.click(nextBtn);
    expect(screen.getByText("5/6")).toBeDefined();
    expect(screen.getByText(/PASSADO/i)).toBeDefined();
    expect(screen.getByText(/PRESENTE/i)).toBeDefined();
    expect(screen.getByText(/FUTURO/i)).toBeDefined();

    // Step 5 -> 6
    fireEvent.click(nextBtn);
    expect(screen.getByText("6/6")).toBeDefined();
    expect(screen.getByText(/DESCOBRIR MEU DESTINO →/i)).toBeDefined();
    expect(screen.getAllByText(/DADOS 100% PRIVADOS/i).length).toBeGreaterThanOrEqual(1);
  });
});
