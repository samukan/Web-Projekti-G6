// playwright.config.ts

import {PlaywrightTestConfig} from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  use: {
    // Selaimet
    browserName: 'chromium',
    // Resoluutiot
    viewport: {width: 1280, height: 720},
  },
  projects: [
    // Desktop testit
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        viewport: {width: 1280, height: 720},
      },
    },
    {
      name: 'Desktop Firefox',
      use: {
        browserName: 'firefox',
        viewport: {width: 1280, height: 720},
      },
    },
    {
      name: 'Desktop Safari',
      use: {
        browserName: 'webkit',
        viewport: {width: 1280, height: 720},
      },
    },
    // Mobile testit
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        viewport: {width: 375, height: 667},
      },
    },
    {
      name: 'Mobile Firefox',
      use: {
        browserName: 'firefox',
        viewport: {width: 375, height: 667},
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        browserName: 'webkit',
        viewport: {width: 375, height: 667},
      },
    },
  ],
};

export default config;
