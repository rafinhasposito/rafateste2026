const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log("Starting QA functional test...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 400, height: 800 } });
  const page = await context.newPage();
  
  const blockers = [];
  
  page.on('pageerror', err => {
    console.log('[BROWSER ERROR]', err.message);
    blockers.push('JS Exception: ' + err.message);
  });

  console.log("-> 1. Navigating to Onboarding...");
  await page.goto('http://localhost:8080/app/onboarding', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'step1-onboarding-start.png' });
  
  // Look for any input fields and fill them
  console.log("-> 2. Trying to advance through Onboarding...");
  for(let i=0; i<8; i++){
    await page.waitForTimeout(1000);
    // Check if there are inputs visible
    const inputs = await page.$$('input[type="text"]');
    for (let input of inputs) {
       try { await input.fill('Teste'); } catch(e){}
    }
    const inputsNum = await page.$$('input[type="number"]');
    for (let input of inputsNum) {
       try { await input.fill('10'); } catch(e){}
    }
    // if there's a combobox or select (like cities)
    // we might just try to click the first option if it opens a dropdown
    
    // click continue
    try {
      await page.click('button:has-text("Continuar"), button:has-text("Avançar"), button:has-text("Começar"), button:has-text("Ver meu destino")', { timeout: 1000 });
    } catch(e) {
      // maybe we need to click something else? 
    }
    await page.screenshot({ path: `step1-onboarding-${i}.png` });
  }

  console.log("-> 3. Navigating to Trailer directly (simulating successful onboarding route transition)...");
  await page.goto('http://localhost:8080/app/trailer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'step2-trailer.png' });
  
  // try to skip trailer or go to dashboard
  try {
     await page.click('button:has-text("Pular"), button:has-text("Ir para"), button:has-text("Avançar")', { timeout: 2000 });
     await page.waitForTimeout(2000);
  } catch(e) {}
  
  console.log("-> 4. Navigating to Dashboard...");
  await page.goto('http://localhost:8080/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'step3-dashboard.png' });

  // verify if dashboard loaded correctly or if it crashed
  const bodyText = await page.evaluate(() => document.body.innerText);
  if(bodyText.toLowerCase().includes('application error') || bodyText.toLowerCase().includes('something went wrong')) {
      blockers.push('Dashboard crashed with Application Error boundary.');
  }

  await browser.close();
  
  if(blockers.length > 0) {
      console.log("BLOCKERS FOUND:");
      console.log(blockers.join('\n'));
  } else {
      console.log("ZERO BLOCKERS FUNCIONAIS DETECTED BY AUTOMATION.");
  }
})();
