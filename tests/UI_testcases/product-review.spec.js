const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Review submission on product detail

test.describe('Product Review Flow', () => {
  test('should submit a review for a product', async ({ page }) => {
    await common.verifyHome(page);
    await page.click(selectors.productsLink);
    await expect(page.locator(selectors.productsHeading)).toBeVisible();

    // open first product detail
    await page.click(selectors.firstProductViewButton);
    // reveal review tab
    await page.click(selectors.reviewTab);
    await page.waitForSelector(selectors.reviewTextInput, { timeout: 10000 });

    // fill review form
    await page.fill(selectors.reviewNameInput, 'Test Reviewer');
    await page.fill(selectors.reviewEmailInput, 'test@example.com');
    await page.fill(selectors.reviewTextInput, 'This is a sample review.');
    await page.click(selectors.reviewSubmitButton);

    await page.waitForSelector(selectors.reviewSuccessMessage, { timeout: 10000 });
    await expect(page.locator(selectors.reviewSuccessMessage)).toBeVisible();
  });
});