import { test } from '@playwright/test';
const dir = '/Users/rafaelgeorge/.gemini/antigravity/brain/3fcde90d-f635-47ce-abb6-7a67447af4b0/screenshots/onboarding';

test('CaptureOnboardingFlow', async ({ page }) => {
  test.setTimeout(120000);
  
  const capture = async (vpName, w, h) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/app/onboarding');
    await page.waitForLoadState('networkidle');
    
    for (let i = 1; i <= 6; i++) {
      await page.waitForTimeout(2000); // Let framer-motion transition complete
      await page.screenshot({ path: `${dir}/screen${i}-${vpName}.png` });
      
      if (i < 6) {
        await page.locator('button:visible').last().click({ force: true });
      }
    }
  };

  await capture('desktop', 1440, 900);
  await capture('mobile', 375, 812);
});
