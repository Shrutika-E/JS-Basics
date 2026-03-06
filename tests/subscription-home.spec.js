const { test, expect } = require('@playwright/test');
const common = require('./helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('./helpers/selectors');
const registerHooks = require('./helpers/hooks');
registerHooks(test);

// Verify Subscription in home page

test.describe('Test Case 10 - Subscription on Home Page', () => {
  test('should subscribe successfully from home page', async ({ page }) => {
    try {
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      // scroll down to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForSelector(selectors.subscriptionHeading, { state: 'visible', timeout: 10000 });
      await expect(page.locator(selectors.subscriptionHeading)).toBeVisible();
      console.log('✓ Subscription section visible');

      const email = `test${Date.now()}@example.com`;
      await page.fill(selectors.subscriptionInput, email);
      await page.click(selectors.subscriptionButton);

      await page.waitForSelector(selectors.subscriptionSuccessMessage, { state: 'visible', timeout: 10000 });
      console.log('✓ Subscription success message visible');
    } catch (error) {
      await takeFailureScreenshot(page, 'subscription-home');
      throw error;
    }
  });
});