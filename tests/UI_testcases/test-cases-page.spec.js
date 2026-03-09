const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Verify Test Cases Page
// steps as described in Test Case 7

test.describe('Test Case 7 - Test Cases Page', () => {
  test('should navigate to test cases page successfully', async ({ page }) => {
    try {
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      await page.click(selectors.testCasesLink);
      await page.waitForLoadState('domcontentloaded');

      // verify url or heading
      await expect(page).toHaveURL(/.*\/test_cases/);
      await expect(page.locator('h2.title.text-center')).toHaveText(/Test Cases/i);
      console.log('✓ Test Cases page visible');
    } catch (error) {
      await takeFailureScreenshot(page, 'testcases-page');
      throw error;
    }
  });
});