import { test } from '@playwright/test';

test('Check console errors on home', async ({ page }) => {
  page.on('console', msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.error(`[PAGE_ERROR] ${err.message}`));

  await page.goto('http://localhost:3000/?resetOnboarding=true', { waitUntil: 'networkidle' });
  console.log("Navigated to Home with reset...");
  
  await page.waitForTimeout(2000);
});
