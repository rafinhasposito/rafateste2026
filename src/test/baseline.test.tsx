import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MobileOnboarding } from '../components/mobile/onboarding/MobileOnboarding';

// Mocking framer-motion to avoid complex animation rendering issues in JSDOM
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual as any,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, className, onClick }: any) => <div className={className} onClick={onClick}>{children}</div>,
      p: ({ children, className }: any) => <p className={className}>{children}</p>,
      h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
      h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
      h3: ({ children, className }: any) => <h3 className={className}>{children}</h3>,
      span: ({ children, className }: any) => <span className={className}>{children}</span>,
      button: ({ children, className, onClick }: any) => <button className={className} onClick={onClick}>{children}</button>,
    }
  };
});

describe('Phase 0 Baseline: Critical Flow Smoke Tests', () => {
  
  it('should render the Onboarding flow without crashing', () => {
    render(
      <BrowserRouter>
        <MobileOnboarding />
      </BrowserRouter>
    );
    
    // Checks if the Onboarding mounts properly by looking for the "Protocolo Solar" brand header or similar
    expect(screen.getByText(/Protocolo Solar/i)).toBeInTheDocument();
  });

  // TECHNICAL DEBT DOCUMENTATION (Phase 0 Baseline):
  // 1. App.tsx mounting requires deeply nested QueryClientProvider, AuthProvider (Supabase), and TooltipProvider.
  // 2. Index.tsx requires mocking geolocation API, Supabase profiles, and the Astro Engine.
  // 3. DestinyResults.tsx requires mocking OpenAI fetches (generateDestinyInsight).
  // 
  // These are currently coupled. Attempting to render them in JSDOM without massive 
  // architectural mocks will result in false negatives. They are documented here to be 
  // safely isolated during Phase 6 (Results) and Phase 5 (Discovery).
});
