import { test, expect } from '@playwright/test';

test.describe('App Stability and Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to root to set local storage first
    await page.goto('http://localhost:8080');
    
    // Set fake local storage session
    await page.evaluate(() => {
      localStorage.setItem('ps_onboarding_completed', 'true');
      const fakeSession = {
        access_token: "fake",
        token_type: "bearer",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: "fake",
        user: {
          id: "fake-user-id",
          aud: "authenticated",
          role: "authenticated",
          email: "test@example.com",
          app_metadata: { provider: "email" },
          user_metadata: {}
        }
      };
      localStorage.setItem('sb-gvqdlsflrbctfiorimcl-auth-token', JSON.stringify(fakeSession));
    });

    await page.route('**/*.supabase.co/rest/v1/profiles*', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ display_name: "Test", credits: 10 }]) });
    });
    await page.route('**/*.supabase.co/rest/v1/consultations*', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
  });

  test('Flow: Por Cidade', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.click('text=Futuro'); // select mode
    await page.click('text=Por Cidade'); // select path
    
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).not.toContain('Conexão Interrompida');
  });

  test('Flow: Por Casa', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.click('text=Futuro');
    await page.click('text=Por Casa');
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).not.toContain('Conexão Interrompida');
  });

  test('Flow: Por Intenção', async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.click('text=Futuro');
    await page.click('text=Por Intenção');
    const text = await page.evaluate(() => document.body.innerText);
    expect(text).not.toContain('Conexão Interrompida');
  });
});
