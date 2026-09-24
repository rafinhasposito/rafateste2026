const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/auth', { waitUntil: 'networkidle' });
  
  // Intercept the request to Supabase to see the redirect URL
  page.on('request', request => {
    if (request.url().includes('authorize')) {
      console.log('Intercepted Google Authorize URL:', request.url());
    }
  });
  
  await page.click('button:has-text("Google")');
  
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
