const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Verify Product quantity in Cart

test.describe('Test Case 13 - Product quantity in Cart', () => {
  test('should update quantity and verify in cart', async ({ page }) => {
    try {
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      // click view product for first product on home page
      await page.click('a:has-text("View Product")');
      await page.waitForLoadState('domcontentloaded');

      // increase quantity to 4
      await page.fill('#quantity', '4');

      // add to cart
      await page.click('button:has-text("Add to cart")');
      await page.waitForSelector('text=View Cart', { timeout: 5000 });
      await page.click('text=View Cart');

      // verify cart
      await page.waitForSelector(selectors.cartQuantityInput, { timeout: 10000 });
      const qty = await page.locator(selectors.cartQuantityInput).first().textContent();
      expect(qty.trim()).toBe('4');
      console.log('✓ Quantity in cart verified as 4');
    } catch (error) {
      await takeFailureScreenshot(page, 'quantity-cart');
      throw error;
    }
  });
});