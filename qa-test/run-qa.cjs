const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  console.log("Navigating to Onboarding...");
  try {
    const response = await page.goto('http://localhost:8080/app/onboarding', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log("Status:", response.status());
  } catch (err) {
    console.log("Failed to load localhost:8080. Retrying with 5173...");
    await page.goto('http://localhost:5173/app/onboarding', { waitUntil: 'networkidle0' });
  }

  await page.screenshot({ path: 'qa-step1.png' });
  console.log("At:", page.url());

  // Wait a bit to ensure animations finish
  await new Promise(r => setTimeout(r, 2000));

  console.log("Trying to progress through onboarding...");
  for(let i=0; i<10; i++){
     try {
       // Look for generic continue buttons
       const nextBtn = await page.evaluate(() => {
         const buttons = Array.from(document.querySelectorAll('button'));
         const btn = buttons.find(b => {
           const t = b.innerText.toLowerCase();
           return t.includes('continuar') || t.includes('avançar') || t.includes('próximo') || t.includes('começar');
         });
         if(btn) {
           btn.click();
           return true;
         }
         return false;
       });
       
       if(nextBtn) {
         console.log("Clicked a continue button.");
         await new Promise(r => setTimeout(r, 2000));
       } else {
         console.log("No continue button found for step", i);
         // Try checking if we are on a form where we need to input data first?
         const inputs = await page.$$('input');
         if(inputs.length > 0) {
             console.log("Found inputs, trying to fill them...");
             // Fill all inputs with 'test' just in case
             for (const input of inputs) {
               try { await input.type('test'); } catch(e){}
             }
             // Try click continue again
             await page.evaluate(() => {
                 const buttons = Array.from(document.querySelectorAll('button'));
                 const btn = buttons.find(b => b.innerText.toLowerCase().includes('continuar'));
                 if(btn) btn.click();
             });
             await new Promise(r => setTimeout(r, 2000));
         } else {
             break;
         }
       }
     } catch(e) {
       console.log("Error in step", i, e.message);
       break;
     }
  }

  // We need to see if we reached trailer or results
  console.log("Current URL after onboarding:", page.url());
  await page.screenshot({ path: 'qa-step2.png' });

  // Navigate to Dashboard explicitly to see if it loads or crashes
  console.log("Navigating to Results...");
  await page.goto('http://localhost:8080/app/results', { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 3000));
  console.log("Current URL after results:", page.url());
  await page.screenshot({ path: 'qa-step3.png' });
  
  // Look for any blockers
  const bodyText = await page.evaluate(() => document.body.innerText);
  if(bodyText.toLowerCase().includes('application error') || bodyText.toLowerCase().includes('error')) {
      console.log("FOUND ERROR TEXT ON PAGE:", bodyText.substring(0, 500));
  }

  await browser.close();
  console.log("QA script finished.");
})();
