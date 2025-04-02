import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
});

export default defineConfig({
  testDir,
  timeout: 120_000,
  reporter: [
    cucumberReporter('html', {
      outputFile: 'cucumber-report/index.html',
      externalAttachments: true,
    }),
    ['html', { open: 'never' }],
  ],
  use: {
    screenshot: 'on',
    trace: 'on',
    baseURL: 'https://magento.softwaretestingboard.com/',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
       },
    },
  ],
});
