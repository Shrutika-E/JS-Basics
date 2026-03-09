const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Verify Subscription in Cart page

test.describe('Test Case 11 - Subscription on Cart Page', () => {
  test('should subscribe successfully from cart page', async ({ page }) => {
    try {
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      await page.click(selectors.cartLink);
      await page.waitForLoadState('domcontentloaded');
      console.log('✓ Cart page opened');

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForSelector(selectors.subscriptionHeading, { state: 'visible', timeout: 10000 });
      await expect(page.locator(selectors.subscriptionHeading)).toBeVisible();

      const email = `test${Date.now()}@example.com`;
      await page.fill(selectors.subscriptionInput, email);
      await page.click(selectors.subscriptionButton);
      await page.waitForSelector(selectors.subscriptionSuccessMessage, { state: 'visible', timeout: 10000 });
      console.log('✓ Subscription success message visible');
    } catch (error) {
      await takeFailureScreenshot(page, 'subscription-cart');
      throw error;
    }
  });
});