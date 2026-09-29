const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log("Navigating to Onboarding...");
  try {
    const response = await page.goto('http://localhost:8080/app/onboarding', { waitUntil: 'networkidle', timeout: 30000 });
    console.log("Status:", response.status());
  } catch (err) {
    console.log("Failed to load localhost:8080. Retrying with 5173...");
    await page.goto('http://localhost:5173/app/onboarding', { waitUntil: 'networkidle' });
  }

  console.log("Taking screenshot of initial onboarding page...");
  await page.screenshot({ path: 'qa-step1.png' });

  // Simulate user filling the onboarding if there are elements. Let's just find the generic "continue" buttons.
  console.log("Trying to progress through onboarding...");
  for(let i=0; i<5; i++){
     try {
       // try clicking "Continuar" or "Avançar"
       const btn = await page.waitForSelector('button:has-text("Continuar"), button:has-text("Avançar"), button:has-text("Próximo")', { timeout: 3000 });
       if(btn) {
         await btn.click();
         await page.waitForTimeout(1000);
       }
     } catch(e) {
       console.log("No continue button found for step", i);
       break;
     }
  }

  // We need to see if we reached trailer or results
  console.log("Current URL:", page.url());
  await page.screenshot({ path: 'qa-step2.png' });

  await browser.close();
  console.log("QA script finished.");
})();
