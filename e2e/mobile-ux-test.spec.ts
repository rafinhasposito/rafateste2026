import { test } from '@playwright/test';
import fs from 'fs';

const dir = '/Users/rafaelgeorge/.gemini/antigravity/brain/3fcde90d-f635-47ce-abb6-7a67447af4b0/screenshots/mobile-ux';

test('Mobile UX Flow Capture', async ({ page }) => {
  test.setTimeout(120000);
  
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const runViewport = async (vpName, w, h) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('http://localhost:3000/?resetOnboarding=true');
    await page.waitForLoadState('networkidle');
    
    await page.evaluate(() => localStorage.setItem('ps_onboarding_completed', 'true'));
    
    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: `${dir}/1-selecao-temporal-${vpName}.png` });

    const btnFuturo = page.locator('button:has-text("Futuro")');
    await btnFuturo.click();
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: `${dir}/2-como-consultar-${vpName}.png` });

    const btnCidade = page.locator('button:has-text("Por Cidade")');
    await btnCidade.click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: `${dir}/3-por-cidade-${vpName}.png`, fullPage: true });

    await page.reload();
    await page.locator('button:has-text("Futuro")').click();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Por Casa")').click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: `${dir}/4-por-casa-${vpName}.png`, fullPage: true });

    await page.reload();
    await page.locator('button:has-text("Futuro")').click();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Por Intenção")').click();
    await page.waitForTimeout(1000);

    await page.screenshot({ path: `${dir}/5-por-intencao-${vpName}.png`, fullPage: true });
  };

  await runViewport('375x812', 375, 812);
  await runViewport('430x932', 430, 932);
  await runViewport('1440x900', 1440, 900);
});
