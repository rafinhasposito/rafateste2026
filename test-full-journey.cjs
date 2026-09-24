const { chromium } = require('playwright');
const fs = require('fs');

const viewports = [
  { name: 'Mobile_Mini', width: 375, height: 812 },
  { name: 'Desktop_Standard', width: 1440, height: 900 }
];

const checkOverflow = async (page, stepName) => {
  const result = await page.evaluate(() => {
    return {
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth
    };
  });
  if (result.scroll > result.client) {
    console.log(`[OVERFLOW DETECTED] ${stepName}: scrollWidth (${result.scroll}) > clientWidth (${result.client})`);
  } else {
    console.log(`[NO OVERFLOW] ${stepName}`);
  }
};

(async () => {
  if (!fs.existsSync('screenshots-output-real')) fs.mkdirSync('screenshots-output-real');
  
  const browser = await chromium.launch();
  
  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();
    
    // ONBOARDING
    console.log("Navigating to Onboarding...");
    await page.goto('http://localhost:3000/app/onboarding', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    for (let i = 1; i <= 6; i++) {
      await page.waitForTimeout(1000);
      await checkOverflow(page, `Onboarding_Step_${i}`);
      await page.screenshot({ path: `screenshots-output-real/${vp.name}_Onboarding_${i}.png` });
      
      if (i < 6) {
        // Click "Continuar"
        await page.click('button:has-text("Continuar")');
      } else {
        // Click "Começar Minha Análise" or whatever the final button is
        try {
          await page.click('button:has-text("Começar")');
        } catch(e) {}
      }
    }
    
    // Auth Test
    console.log("Navigating to Auth...");
    await page.goto('http://localhost:3000/auth', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await checkOverflow(page, `Auth`);
    await page.screenshot({ path: `screenshots-output-real/${vp.name}_Auth.png` });
    
    // Try to signup with random email
    const randEmail = `test_${Date.now()}@test.com`;
    // We need to click "Crie sua conta estelar" or toggle to signup mode
    // Actually the Auth page mode defaults to signin, we'll try to just check if it allows testing protected routes.
    // I won't do full signup if email confirmation is required, but let's test the layout anyway.
    
    await context.close();
  }
  
  await browser.close();
})();
