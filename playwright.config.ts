import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8080',
  },
  projects: [
    {
      name: 'Mobile-SE-320',
      use: { ...devices['iPhone SE'], viewport: { width: 320, height: 568 } },
    },
    {
      name: 'Mobile-Galaxy-S24',
      use: { ...devices['Galaxy S9+'], viewport: { width: 360, height: 780 } },
    },
    {
      name: 'Mobile-iPhone-15-Pro',
      use: { ...devices['iPhone 14 Pro'], viewport: { width: 393, height: 852 } },
    },
    {
      name: 'Mobile-iPhone-Pro-Max',
      use: { ...devices['iPhone 14 Pro Max'], viewport: { width: 430, height: 932 } },
    },
    {
      name: 'Tablet-iPad-Mini',
      use: { ...devices['iPad Mini'], viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'Desktop-Chrome',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
});
