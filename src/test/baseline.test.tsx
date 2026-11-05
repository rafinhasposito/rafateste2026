import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MobileOnboarding from '../components/mobile/onboarding/MobileOnboarding';

describe('Phase 0 Baseline: Critical Flow Smoke Tests', () => {
  
  it('should render the Onboarding flow without crashing', () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(
      <BrowserRouter>
        <MobileOnboarding />
      </BrowserRouter>
    );
    
    // Checks if the Onboarding mounts properly by looking for the "Protocolo Solar" brand header or similar
    expect(screen.getByRole("img", { name: "Protocolo Solar" })).toBeInTheDocument();
    vi.restoreAllMocks();
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
