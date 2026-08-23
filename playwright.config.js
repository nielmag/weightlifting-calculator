const { defineConfig } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.steps.js',
});

module.exports = defineConfig({
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'node scripts/serve.js',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'e2e', testDir: './tests' },
    { name: 'bdd', testDir: bddTestDir },
  ],
});
