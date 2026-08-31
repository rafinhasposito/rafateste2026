import { test } from '@playwright/test';
const dir = '/Users/rafaelgeorge/.gemini/antigravity/brain/3fcde90d-f635-47ce-abb6-7a67447af4b0/screenshots/concepts';

test('Concept-A-Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/concepts?c=A'); await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${dir}/concept-A-desktop.png`, fullPage: false });
});
test('Concept-A-Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/concepts?c=A'); await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${dir}/concept-A-mobile.png`, fullPage: false });
});

test('Concept-B-Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/concepts?c=B'); await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${dir}/concept-B-desktop.png`, fullPage: false });
});
test('Concept-B-Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/concepts?c=B'); await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${dir}/concept-B-mobile.png`, fullPage: false });
});

test('Concept-C-Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/concepts?c=C'); await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${dir}/concept-C-desktop.png`, fullPage: false });
});
test('Concept-C-Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/concepts?c=C'); await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${dir}/concept-C-mobile.png`, fullPage: false });
});
