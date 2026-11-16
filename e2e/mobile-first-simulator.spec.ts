import { test, expect } from '@playwright/test';

const ROUTES_TO_CHECK = [
  '/',
  '/auth',
  '/credits',
  '/tecnologia',
  '/app/onboarding',
  '/app/onboarding-v2',
];

for (const route of ROUTES_TO_CHECK) {
  test(`Mobile FIRST Simulator Audit — ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });

    // 1. Zero horizontal overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - window.innerWidth;
    });
    expect(overflow, `Overflow horizontal detectado em ${route}`).toBeLessThanOrEqual(1);

    // 2. Inputs com font-size >= 16px (evita auto-zoom no iOS Safari)
    const smallInputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      return inputs
        .filter((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return false;
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize || '16');
          return fontSize < 16;
        })
        .map((el) => el.outerHTML.slice(0, 80));
    });
    expect(smallInputs, `Inputs com fonte < 16px em ${route}`).toEqual([]);

    // 3. Nenhum botão visível cortado fora da tela
    const clippedButtons = await page.evaluate(() => {
      const vw = window.innerWidth;
      const buttons = Array.from(document.querySelectorAll('button, a[role="button"]'));
      return buttons
        .filter((el) => {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return false;
          return rect.left < -2 || rect.right > vw + 2;
        })
        .map((el) => (el.textContent || '').trim().slice(0, 40));
    });
    expect(clippedButtons, `Botões cortados lateralmente em ${route}`).toEqual([]);
  });
}
