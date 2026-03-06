const { test, expect } = require('@playwright/test');
const common = require('./helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('./helpers/selectors');
const registerHooks = require('./helpers/hooks');
registerHooks(test);

// Search Product

test.describe('Test Case 9 - Search Product', () => {
  test('should search products and display results', async ({ page }) => {
    try {
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      await page.click(selectors.productsLink);
      await page.waitForSelector(selectors.productsHeading, { state: 'visible', timeout: 10000 });
      console.log('✓ Navigated to ALL PRODUCTS');

      const searchTerm = 'Dress';
      await page.fill(selectors.productSearchInput, searchTerm);
      await page.click(selectors.productSearchButton);

      await page.waitForSelector(selectors.searchedProductsHeading, { state: 'visible', timeout: 10000 });
      await expect(page.locator(selectors.searchedProductsHeading)).toHaveText(/Searched Products/i);

      const items = await page.locator(selectors.firstProductViewButton).count();
      expect(items).toBeGreaterThan(0);
      console.log('✓ Search results displayed');
    } catch (error) {
      await takeFailureScreenshot(page, 'search-product');
      throw error;
    }
  });
});