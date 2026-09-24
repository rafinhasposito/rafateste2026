import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ConsumerShell } from '../layouts/ConsumerShell';
import { FocusedShell } from '../layouts/FocusedShell';
import { useState } from 'react';

// Mock do matchMedia
let mediaQueryListener: ((e: any) => void) | null = null;

const setDesktop = (isDesktop: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: isDesktop,
      media: query,
      onchange: null,
      addListener: vi.fn(), 
      removeListener: vi.fn(), 
      addEventListener: (evt: string, listener: any) => {
        if (evt === 'change') mediaQueryListener = listener;
      },
      removeEventListener: (evt: string, listener: any) => {
        if (evt === 'change' && mediaQueryListener === listener) mediaQueryListener = null;
      },
      dispatchEvent: vi.fn(),
    })),
  });
  
  if (mediaQueryListener) {
    mediaQueryListener({ matches: isDesktop });
  }
};

// Componente filho (simulando um formulário) para testar preservação de estado
const TestForm = () => {
  const [value, setValue] = useState('');
  return (
    <div>
      <h1 data-testid="test-content">Conteúdo do Teste</h1>
      <input 
        data-testid="test-input"
        type="text" 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
      />
    </div>
  );
};

// Mocks dos Chromes
vi.mock('../layouts/MobileAppChrome', () => ({
  MobileAppChrome: () => <div data-testid="mobile-chrome">Mobile Chrome</div>
}));

vi.mock('../layouts/DesktopWebChrome', () => ({
  DesktopWebChrome: () => <div data-testid="desktop-chrome">Desktop Chrome</div>
}));

// Mock StarryBackground
vi.mock('../components/StarryBackground', () => ({
  default: () => <div data-testid="starry-bg" />
}));

describe('App Shells Architecture', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ConsumerShell', () => {
    it('renderiza o MobileChrome em viewports menores que 1024px', () => {
      setDesktop(false); // Simulando mobile
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<ConsumerShell />}>
              <Route path="/" element={<TestForm />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('mobile-chrome')).toBeInTheDocument();
      expect(screen.queryByTestId('desktop-chrome')).not.toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('renderiza o DesktopChrome em viewports a partir de 1024px', () => {
      setDesktop(true); // Simulando desktop
      
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<ConsumerShell />}>
              <Route path="/" element={<TestForm />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('mobile-chrome')).not.toBeInTheDocument();
      expect(screen.getByTestId('desktop-chrome')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('PRESERVA O ESTADO LOCAL DA PÁGINA (Outlet) ao simular mudança de viewport', () => {
      setDesktop(false);
      
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<ConsumerShell />}>
              <Route path="/" element={<TestForm />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // 1. Mobile Chrome está montado
      expect(screen.getByTestId('mobile-chrome')).toBeInTheDocument();
      
      // 2. Preenche o input
      const input = screen.getByTestId('test-input') as HTMLInputElement;
      act(() => {
        input.value = 'teste_preservacao';
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      });
      
      expect(input.value).toBe('teste_preservacao');

      // 3. Muda para Desktop (1024px+)
      act(() => {
        setDesktop(true);
      });

      // 4. Desktop Chrome montado, Mobile escondido
      expect(screen.getByTestId('desktop-chrome')).toBeInTheDocument();
      expect(screen.queryByTestId('mobile-chrome')).not.toBeInTheDocument();

      // 5. VALOR CONTINUA LÁ (Outlet não desmontou)
      const inputAfter = screen.getByTestId('test-input') as HTMLInputElement;
      expect(inputAfter.value).toBe('teste_preservacao');
    });
  });

  describe('FocusedShell', () => {
    it('renderiza conteúdo sem os chromes principais, mas com botão voltar', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<FocusedShell />}>
              <Route path="/" element={<TestForm />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByTestId('desktop-chrome')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mobile-chrome')).not.toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });
});
