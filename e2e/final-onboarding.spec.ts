import { test } from '@playwright/test';
const dir = '/Users/rafaelgeorge/.gemini/antigravity/brain/3fcde90d-f635-47ce-abb6-7a67447af4b0/screenshots/onboarding';

const steps = 6;
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 }
];

for (const vp of viewports) {
  test(`Onboarding-${vp.name}`, async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/app/onboarding');
    await page.waitForLoadState('networkidle');
    
    for (let i = 1; i <= steps; i++) {
      // Wait for animations
      await page.waitForTimeout(1500); 
      await page.screenshot({ path: `${dir}/screen${i}-${vp.name}.png`, fullPage: false });
      
      // Don't click on the last screen
      if (i < steps) {
        // Find the generic "Next" button in our new screens
        await page.getByRole('button').first().click();
      }
    }
  });
}
