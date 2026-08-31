import { test, expect } from '@playwright/test';

test.describe('Responsive Tests', () => {
  test('mobile viewport should not have horizontal overflow on index', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(w).toBeLessThanOrEqual(375);
  });

  test('desktop viewport should render hero section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    
    await expect(page.locator('text=DESCUBRA ONDE PASSAR')).toBeVisible();
  });
});
