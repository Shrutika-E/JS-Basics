const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Test Case 25: Verify Scroll Up using 'Arrow' button and Scroll Down functionality

test.describe('Test Case 25 - Scroll Up using Arrow Button', () => {
  test('should scroll up using arrow button', async ({ page }) => {
    // 1-3: Launch and verify home
    await common.verifyHome(page);

    // 4: Scroll down to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 5: Verify SUBSCRIPTION is visible
    await expect(page.locator(selectors.subscriptionHeading)).toBeVisible();

    // 6: Click on arrow at bottom right side to move upward
    await page.click(selectors.scrollUpArrow, { force: true });

    // 7: Verify that page is scrolled up and 'Full-Fledged practice website for Automation Engineers' text is visible
    await expect(page.locator(selectors.fullFledgedText).first()).toBeVisible();
  });
});