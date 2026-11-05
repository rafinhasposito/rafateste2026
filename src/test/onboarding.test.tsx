import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MobileOnboarding from "../components/mobile/onboarding/MobileOnboarding";

function abrirApresentacao() {
  render(<MemoryRouter><MobileOnboarding /></MemoryRouter>);
}

async function continuar(etapa: number) {
  fireEvent.click(screen.getByRole("button", { name: "CONTINUAR" }));
  await screen.findByText(`${etapa} de 6`);
}

describe("Apresentação de seis telas", () => {
  beforeEach(() => vi.stubGlobal("scrollTo", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("mostra marca, título, etapa inicial e botão de navegação", () => {
    abrirApresentacao();
    expect(screen.getByRole("img", { name: "Protocolo Solar" })).toBeVisible();
    expect(screen.getByRole("heading", { name: /Descubra onde passar/ })).toBeInTheDocument();
    expect(screen.getByText("1 de 6")).toBeVisible();
    expect(screen.getByRole("button", { name: "CONTINUAR" })).toBeVisible();
  });

  it("abre os detalhes de uma cidade na segunda tela e permite voltar", async () => {
    abrirApresentacao();
    await continuar(2);
    const cidade = await screen.findByRole("button", { name: /Tóquio/ });
    fireEvent.click(cidade);
    expect(cidade).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByText("Para quem é").filter(el => !el.closest("[hidden]"))).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(await screen.findByText("1 de 6")).toBeVisible();
  });

  it("percorre as seis telas até a prévia de Roma", async () => {
    abrirApresentacao();
    for (let etapa = 2; etapa <= 6; etapa++) await continuar(etapa);
    expect(await screen.findByRole("heading", { name: "Roma, Itália" })).toBeInTheDocument();
    const previa = screen.getByRole("button", { name: "Ver prévia das mudanças" });
    fireEvent.click(previa);
    expect(previa).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "REVELAR MEU DESTINO" })).toBeInTheDocument();
  });
});
