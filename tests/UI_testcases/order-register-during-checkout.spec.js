const { test, expect } = require('@playwright/test');
const userData = require('../helpers/userData');
const common = require('../helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Place Order: Register while Checkout

test.describe('Test Case 14 - Place Order: Register while Checkout', () => {
  test('should register during checkout and place an order', async ({ page }) => {
    try {
      // start from home and verify
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      // add a product to cart
      await page.click(selectors.productsLink);
      await page.waitForSelector(selectors.productsHeading, { state: 'visible', timeout: 10000 });
      await page.hover('.features_items .product-image-wrapper');
      await page.click(selectors.firstProductAddToCart);
      await page.waitForSelector('text=Continue Shopping', { timeout: 5000 });
      await page.click('text=Continue Shopping');

      // go to cart and proceed
      await page.click(selectors.cartLink);
      await page.waitForLoadState('domcontentloaded');
      await page.click(selectors.proceedToCheckoutButton);

      // now register a new user on the signup page
      const user = userData.generateUser();
      userData.saveUser(user);
      await common.registerUser(page, user);
      // after registration, we should be logged in

      // go back to cart and proceed again
      await page.click(selectors.cartLink);
      await page.waitForLoadState('domcontentloaded');
      await page.click(selectors.proceedToCheckoutButton);

      // verify address details / review order sections
      await page.waitForSelector(selectors.addressDetailsHeading, { timeout: 10000 });
      await expect(page.locator(selectors.reviewOrderHeading)).toBeVisible();

      // enter comment and place order
      await page.fill(selectors.commentTextArea, 'Please deliver between 9am-5pm');
      await page.click(selectors.placeOrderButton);

      // fill payment details
      await page.fill(selectors.nameOnCardInput, user.name);
      await page.fill(selectors.cardNumberInput, '4111111111111111');
      await page.fill(selectors.cvcInput, '123');
      await page.fill(selectors.expiryMonthInput, '12');
      await page.fill(selectors.expiryYearInput, '2025');
      await page.click(selectors.payAndConfirmButton);

      // verify order success
      await page.waitForSelector(selectors.orderPlacedMessage, { timeout: 10000 });
      console.log('✓ Order placed successfully');

      // cleanup: delete account
      await page.click(selectors.deleteAccountButton);
      await page.waitForSelector(selectors.accountDeletedText, { timeout: 10000 });
      await page.click(selectors.continueButton);
      console.log('✓ Account deleted');
    } catch (error) {
      await takeFailureScreenshot(page, 'place-order-register-while');
      throw error;
    }
  });
});