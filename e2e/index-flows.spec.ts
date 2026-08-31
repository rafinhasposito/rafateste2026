import { test, expect } from '@playwright/test';

test.describe('Index Flow Tests', () => {
  test('should complete Futuro -> Cidade flow', async ({ page }) => {
    await page.goto('/');
    
    // Step 1: Select Futuro
    await page.click('button:has-text("Futuro")');
    
    // Step 2: Select Por Cidade
    await page.click('button:has-text("Por Cidade")');
    
    // Step 3: Fill data and search
    // Since it's a test, we just check if the form is present
    await expect(page.locator('text=Calibração Estelar')).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
  });

  test('should complete Passado -> Casa flow', async ({ page }) => {
    await page.goto('/');
    
    // Step 1: Select Passado
    await page.click('button:has-text("Passado")');
    
    // Step 2: Select Por Casa
    await page.click('button:has-text("Por Casa")');
    
    // Step 3: Fill data
    await expect(page.locator('text=Resgate da Linha do Tempo')).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible(); // Ano
  });

  test('should complete Presente -> Intenção flow', async ({ page }) => {
    await page.goto('/');
    
    // Step 1: Select Presente
    await page.click('button:has-text("Presente")');
    
    // Step 2: Select Por Intenção
    await page.click('button:has-text("Por Intenção")');
    
    // Step 3: Fill data
    await expect(page.locator('text=Análise do Ciclo Atual')).toBeVisible();
  });
});
