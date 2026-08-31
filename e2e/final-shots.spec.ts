import { test } from '@playwright/test';
const dir = '/Users/rafaelgeorge/.gemini/antigravity/brain/3fcde90d-f635-47ce-abb6-7a67447af4b0/screenshots/final';

test('Final-Desktop-Home', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/'); await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${dir}/home-desktop.png`, fullPage: false });
});

test('Final-Mobile-Home', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/'); await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${dir}/home-mobile.png`, fullPage: false });
});

test('Final-Onboarding', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/app/onboarding'); await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${dir}/onboarding-1.png`, fullPage: false });
  
  await page.getByRole('button', { name: /iniciar|explorar/i }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${dir}/onboarding-2.png`, fullPage: false });

  await page.getByRole('button', { name: /próximo|continuar/i }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${dir}/onboarding-3.png`, fullPage: false });

  await page.getByRole('button', { name: /próximo|continuar/i }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${dir}/onboarding-4.png`, fullPage: false });
  
  await page.getByRole('button', { name: /próximo|continuar/i }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${dir}/onboarding-5.png`, fullPage: false });
});
