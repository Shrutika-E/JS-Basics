const { test, expect } = require('@playwright/test');
const common = require('./helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('./helpers/selectors');
const registerHooks = require('./helpers/hooks');
registerHooks(test);

// Verify All Products and product detail page

test.describe('Test Case 8 - All Products and Product Detail', () => {
  test('should show all products and product detail info', async ({ page }) => {
    try {
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      await page.click(selectors.productsLink);
      await page.waitForSelector(selectors.productsHeading, { state: 'visible', timeout: 10000 });
      // sometimes the page shows different section headings; accept either
      const headingLocator = page.locator(selectors.productsHeading).first();
      await expect(headingLocator).toHaveText(/All Products|Features Items/i);
      console.log('✓ All Products page visible or features items section');

      // click view product of first item, clearing any ads just before
      await page.waitForSelector(selectors.firstProductViewButton, { timeout: 10000 });
      // some ads may appear after navigation; remove them and retry click if necessary
      await common.dismissAds(page);
      try {
        await page.click(selectors.firstProductViewButton, { timeout: 10000 });
      } catch (e) {
        console.warn('Initial click blocked, dismissing ads and retrying');
        await common.dismissAds(page);
        await page.click(selectors.firstProductViewButton, { timeout: 10000, force: true });
      }
      await page.waitForLoadState('domcontentloaded');

      // verify detail info - wait for each element to ensure page is fully loaded
      await page.waitForSelector(selectors.productNameDetail, { timeout: 10000 });
      await expect(page.locator(selectors.productNameDetail)).toBeVisible();

      await page.waitForSelector(selectors.productCategoryDetail, { timeout: 10000 });
      await expect(page.locator(selectors.productCategoryDetail)).toBeVisible();

      // price information may take a moment to render; wait up to 15s
      await page.waitForSelector(selectors.productPriceDetail, { timeout: 15000 });
      const priceLocator = page.locator(selectors.productPriceDetail);
      await expect(priceLocator.first()).toBeVisible();
      // optionally log the retrieved price for debugging
      const priceText = await priceLocator.first().textContent();
      console.log('Price field text:', priceText && priceText.trim());

      await page.waitForSelector(selectors.productAvailabilityDetail, { timeout: 10000 });
      await expect(page.locator(selectors.productAvailabilityDetail)).toBeVisible();

      await page.waitForSelector(selectors.productConditionDetail, { timeout: 10000 });
      await expect(page.locator(selectors.productConditionDetail)).toBeVisible();

      await page.waitForSelector(selectors.productBrandDetail, { timeout: 10000 });
      await expect(page.locator(selectors.productBrandDetail)).toBeVisible();

      console.log('✓ Product detail information visible');
    } catch (error) {
      await takeFailureScreenshot(page, 'all-products-detail');
      throw error;
    }
  });
});