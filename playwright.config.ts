import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8181',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
            args: ['--autoplay-policy=no-user-gesture-required']
        }
      },
    },
  ],
  webServer: {
    command: 'npx http-server . -p 8181',
    url: 'http://127.0.0.1:8181',
    reuseExistingServer: false,
    cwd: './',
  },
});
