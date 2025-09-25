import { chromium, type FullConfig } from '@playwright/test'

async function globalSetup(_config: FullConfig) {
  // Minimal smoke setup so the Playwright test runner can initialise
  const browser = await chromium.launch()
  await browser.close()
}

export default globalSetup
