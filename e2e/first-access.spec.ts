import { test, expect } from '@playwright/test';

test('First Access flow to Onboarding and back', async ({ page }) => {
  // 1. Limpa o ambiente e vai pra home
  await page.goto('http://localhost:3000/?resetOnboarding=true');
  await page.waitForLoadState('networkidle');
  
  // Acessa raiz, não tem o localstorage, deve redirecionar
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('/app/onboarding');

  // Avança até o fim (6 telas)
  for (let i = 1; i <= 6; i++) {
    await page.waitForTimeout(600); 
    if (i < 6) {
      await page.locator('button:visible').last().click();
    } else {
      // CTA final (Começar minha análise)
      await page.locator('button:has-text("Começar Minha Análise")').click();
    }
  }

  // 4. CTA final deve ter voltado para Home e setado LocalStorage
  await page.waitForLoadState('networkidle');
  expect(page.url()).toBe('http://localhost:3000/');

  // 6. Recarrega a home e verifica se fica lá (não mostra onboarding)
  await page.reload();
  await page.waitForLoadState('networkidle');
  expect(page.url()).toBe('http://localhost:3000/');
  
  // Confirma a existência de algum elemento de UI padrão da Home
  const mapPin = await page.locator('text="Passado"').first(); // The Mode tabs exist on the index
  await expect(mapPin).toBeVisible();

  console.log("Fluxo primeiro acesso concluído com sucesso!");
});
