const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Test Case 26: Verify Scroll Up without 'Arrow' button and Scroll Down functionality

test.describe('Test Case 26 - Scroll Up without Arrow Button', () => {
  test('should scroll up without arrow button', async ({ page }) => {
    // 1-3: Launch and verify home
    await common.verifyHome(page);

    // 4: Scroll down to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 5: Verify SUBSCRIPTION is visible
    await expect(page.locator(selectors.subscriptionHeading)).toBeVisible();

    // 6: Scroll up page to top
    await page.evaluate(() => window.scrollTo(0, 0));

    // 7: Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible
    await expect(page.locator(selectors.fullFledgedText).first()).toBeVisible();
  });
});