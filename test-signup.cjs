const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/auth', { waitUntil: 'networkidle' });
  
  // Switch to signup mode
  // The copy says "Não tem uma conta? Crie uma"
  try {
    await page.click('text=Criar uma agora');
    
    await page.fill('input[type="text"]', 'Playwright Test');
    await page.fill('input[type="email"]', `test_${Date.now()}@testplaywright.com`);
    await page.fill('input[type="password"]', 'Playwright123!');
    
    await page.click('button:has-text("Criar minha conta")');
    
    await page.waitForTimeout(3000);
    
    // Check if it redirected to / or shows a toast
    const url = page.url();
    console.log("URL after signup:", url);
    
    const bodyText = await page.innerText('body');
    if (bodyText.includes('Verifique seu email')) {
      console.log("RESULT: Email confirmation required by Supabase.");
    } else if (url.includes('mode=')) {
      console.log("RESULT: Signup successful and auto-logged in.");
    } else {
      console.log("RESULT: Unknown state after signup.");
    }
  } catch (e) {
    console.error(e.message);
  }
  
  await browser.close();
})();
