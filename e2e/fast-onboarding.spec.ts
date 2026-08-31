import { test } from '@playwright/test';
const dir = '/Users/rafaelgeorge/.gemini/antigravity/brain/3fcde90d-f635-47ce-abb6-7a67447af4b0/screenshots/onboarding';

test('FastCapture', async ({ page }) => {
  test.setTimeout(120000);
  
  const capture = async (vpName, w, h) => {
    await page.setViewportSize({ width: w, height: h });
    for (let i = 1; i <= 6; i++) {
      // Force step state via React devtools hack or URL query if supported. 
      // Our UI doesn't support URL queries for steps. We'll use click.
      
      await page.goto('/app/onboarding');
      await page.waitForLoadState('networkidle');
      
      // Fast forward to step i
      for (let s = 1; s < i; s++) {
        await page.waitForTimeout(400); // let transition finish
        await page.locator('button').first().click({ force: true });
      }
      
      await page.waitForTimeout(800); // wait for final transition
      await page.screenshot({ path: `${dir}/screen${i}-${vpName}.png`, fullPage: false });
    }
  };

  await capture('desktop', 1440, 900);
  await capture('mobile', 375, 812);
});
