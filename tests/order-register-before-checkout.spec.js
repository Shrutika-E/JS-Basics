const { test, expect } = require('@playwright/test');
const userData = require('./helpers/userData');
const common = require('./helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('./helpers/selectors');
const registerHooks = require('./helpers/hooks');
registerHooks(test);

// Place Order: Register before Checkout

test.describe('Test Case 15 - Place Order: Register before Checkout', () => {
  test('should register first then place order', async ({ page }) => {
    try {
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      // register user first
      const user = userData.generateUser();
      userData.saveUser(user);
      await common.registerUser(page, user);

      // ensure logged in
      await expect(page.locator(selectors.loggedInText)).toContainText(user.name);

      // add products to cart
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

      // verify address and review
      await page.waitForSelector(selectors.addressDetailsHeading, { timeout: 10000 });
      await expect(page.locator(selectors.reviewOrderHeading)).toBeVisible();

      // comment and place order
      await page.fill(selectors.commentTextArea, 'Test order');
      await page.click(selectors.placeOrderButton);

      // payment
      await page.fill(selectors.nameOnCardInput, user.name);
      await page.fill(selectors.cardNumberInput, '4111111111111111');
      await page.fill(selectors.cvcInput, '123');
      await page.fill(selectors.expiryMonthInput, '12');
      await page.fill(selectors.expiryYearInput, '2025');
      await page.click(selectors.payAndConfirmButton);

      await page.waitForSelector(selectors.orderPlacedMessage, { timeout: 10000 });
      console.log('✓ Order placed successfully');

      // cleanup
      await page.click(selectors.deleteAccountButton);
      await page.waitForSelector(selectors.accountDeletedText, { timeout: 10000 });
      await page.click(selectors.continueButton);
      console.log('✓ Account deleted');
    } catch (error) {
      await takeFailureScreenshot(page, 'place-order-register-before');
      throw error;
    }
  });
});