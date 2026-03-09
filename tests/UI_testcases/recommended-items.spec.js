const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Recommended items cart test

test.describe('Recommended Items Flow', () => {
  test('should add recommended item to cart and verify', async ({ page }) => {
    await common.verifyHome(page);
    // scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForSelector(selectors.recommendedItemsSection, { timeout: 10000 });
    await expect(page.locator(selectors.recommendedItemsSection)).toBeVisible();

    // click the add-to-cart button for the currently visible slide
    await page.click(selectors.activeRecommendedAddToCart);
    await page.click(selectors.recommendedViewCartButton);
    await expect(page).toHaveURL(/view_cart/);
    const count = await page.locator(selectors.cartTableRows).count();
    expect(count).toBeGreaterThan(0);
  });
});