import { defineConfig } from '@playwright/test';
import { base } from './site.config.mjs';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'artifacts/playwright.json' }]],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/serve-test.mjs',
    url: 'http://127.0.0.1:4321' + base,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 1000 },
  },
});
