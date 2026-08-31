import { test } from '@playwright/test';
import fs from 'fs';

const dir = '/Users/rafaelgeorge/.gemini/antigravity/brain/3fcde90d-f635-47ce-abb6-7a67447af4b0/screenshots/onboarding-v3';

test('Onboarding V3 capture', async ({ page }) => {
  test.setTimeout(180000);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const capture = async (vpName: string, w: number, h: number) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('http://localhost:3000/app/onboarding');
    await page.waitForLoadState('networkidle');

    for (let i = 1; i <= 6; i++) {
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${dir}/screen${i}-${vpName}.png` });

      if (i < 6) {
        // Click the universal "Continuar" button (last visible button)
        const btns = page.locator('button:visible');
        const count = await btns.count();
        await btns.nth(count - 1).click();
      }
    }
  };

  await capture('mobile', 375, 812);
  await capture('desktop', 1440, 900);
});
