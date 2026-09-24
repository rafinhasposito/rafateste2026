const { chromium } = require('playwright');
const fs = require('fs');

const viewports = [
  { name: 'Mobile_Mini', width: 375, height: 812 },
  { name: 'Mobile_Pro', width: 430, height: 932 },
  { name: 'Desktop_Standard', width: 1440, height: 900 },
  { name: 'Desktop_Large', width: 1920, height: 1080 }
];

const pagesToTest = [
  { url: 'http://localhost:3000/app/onboarding', name: 'Onboarding' },
  { url: 'http://localhost:3000/?mode=futuro', name: 'Home_Futuro' },
  { url: 'http://localhost:3000/auth', name: 'Auth' },
  { url: 'http://localhost:3000/credits', name: 'Credits' }
];

(async () => {
  if (!fs.existsSync('screenshots-output')) {
    fs.mkdirSync('screenshots-output');
  }

  const browser = await chromium.launch();
  
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });
    
    // Set a fake auth state to allow seeing Credits, Profile, etc.
    await context.addInitScript(() => {
       window.localStorage.setItem('ps_onboarding_completed', 'true');
       window.sessionStorage.setItem('sb-test-user', 'true'); // bypass or mock auth if needed
    });

    for (const p of pagesToTest) {
      const page = await context.newPage();
      try {
        await page.goto(p.url, { waitUntil: 'networkidle' });
        
        // Let animations settle
        await page.waitForTimeout(2000);
        
        const path = `screenshots-output/${vp.name}_${p.name}.png`;
        await page.screenshot({ path, fullPage: false });
        console.log(`Saved ${path}`);
      } catch (e) {
        console.error(`Failed on ${vp.name} - ${p.name}:`, e.message);
      }
      await page.close();
    }
    await context.close();
  }
  
  await browser.close();
})();
