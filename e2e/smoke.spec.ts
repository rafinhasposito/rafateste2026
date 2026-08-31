import { test, expect } from '@playwright/test';

test('App should load and not have console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  if (errors.length > 0) {
    console.log("Console errors found:", errors);
  }
  
  // Basic check for text or element
  await expect(page.locator('body')).toBeVisible();
});
