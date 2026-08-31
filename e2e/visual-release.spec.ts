import { test, expect } from '@playwright/test';
import path from 'path';

const screenshotDir = '/Users/rafaelgeorge/.gemini/antigravity/brain/3fcde90d-f635-47ce-abb6-7a67447af4b0/screenshots';

test.describe('Visual Release Screenshots', () => {
  test('Desktop Hero', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotDir}/01-desktop-hero.png`, fullPage: false });
  });

  test('Desktop Stepper Step 1', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#form-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${screenshotDir}/02-desktop-stepper.png` });
  });

  test('Desktop Step 2 - Mode Selected', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#form-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Futuro/i }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${screenshotDir}/03-desktop-mode-futuro.png` });
  });

  test('Desktop Step 3 - Por Cidade', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#form-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Futuro/i }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Por Cidade/i }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${screenshotDir}/04-desktop-form-cidade.png` });
  });

  test('Mobile Hero', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${screenshotDir}/05-mobile-hero.png`, fullPage: false });
  });

  test('Mobile Stepper', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#form-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${screenshotDir}/06-mobile-stepper.png` });
  });

  test('Mobile Step 2 - Passado', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#form-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Passado/i }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${screenshotDir}/07-mobile-mode-passado.png` });
  });

  test('Mobile Form - Por Casa', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('#form-section').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Presente/i }).first().click();
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: /Por Casa/i }).first().click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${screenshotDir}/08-mobile-form-casa.png` });
  });
});
