const { test, expect } = require('@playwright/test');
const userData = require('../helpers/userData');
const common = require('../helpers/common');
const { takeFailureScreenshot } = common;
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

test.describe('Test Case 16 - Place Order: Login before Checkout', () => {
  test('should login before placing order', async ({ page }) => {
    test.setTimeout(180000);

    try {
      // Prepare user: register first to have credentials
      const user = userData.generateUser();
      userData.saveUser(user);

      // Register the user
      await common.dismissAds(page);
      await common.registerUser(page, user);
      await expect(page.locator(selectors.loggedInText)).toContainText(user.name);

      // Logout to simulate login scenario
      await common.logout(page);

      // Now follow the test case steps

      // 1-3: Launch browser, navigate to home, verify home page
      await common.verifyHome(page);
      console.log('✓ Home page visible');

      // 4: Click 'Signup / Login' button
      await page.click(selectors.signupLoginLinkText);

      // 5: Fill email, password and click 'Login' button
      await page.fill(selectors.loginEmail, user.email);
      await page.fill(selectors.loginPassword, user.password);
      await page.click(selectors.loginButton);

      // 6: Verify 'Logged in as username' at top
      await expect(page.locator(selectors.loggedInText)).toContainText(user.name);
      console.log(`✓ Logged in as ${user.name}`);

      // 7: Add products to cart
      await page.click(selectors.productsLink);
      await page.waitForSelector(selectors.productsHeading, { state: 'visible', timeout: 10000 });
      await page.hover('.features_items .product-image-wrapper');
      await page.click(selectors.firstProductAddToCart);
      await page.waitForSelector('text=Continue Shopping', { timeout: 5000 });
      await page.click('text=Continue Shopping');
      console.log('✓ Product added to cart');

      // 8: Click 'Cart' button
      await page.click(selectors.cartLink);

      // 9: Verify that cart page is displayed
      await page.waitForLoadState('domcontentloaded');
      await page.waitForSelector(selectors.cartTableRows, { timeout: 10000 });
      console.log('✓ Cart page displayed');

      // 10: Click Proceed To Checkout
      await page.click(selectors.proceedToCheckoutButton);

      // 11: Verify Address Details and Review Your Order
      await page.waitForSelector(selectors.addressDetailsHeading, { timeout: 10000 });
      await expect(page.locator(selectors.reviewOrderHeading)).toBeVisible();
      console.log('✓ Address Details and Review Your Order verified');

      // 12: Enter description in comment text area and click 'Place Order'
      await page.fill(selectors.commentTextArea, 'Test order comment');
      await page.click(selectors.placeOrderButton);
      console.log('✓ Comment entered and Place Order clicked');

      // 13: Enter payment details
      await page.fill(selectors.nameOnCardInput, user.name);
      await page.fill(selectors.cardNumberInput, '4111111111111111');
      await page.fill(selectors.cvcInput, '123');
      await page.fill(selectors.expiryMonthInput, '12');
      await page.fill(selectors.expiryYearInput, '2025');

      // 14: Click 'Pay and Confirm Order' button
      await page.click(selectors.payAndConfirmButton);

      // 15: Verify success message 'Your order has been placed successfully!'
      await page.waitForSelector(selectors.orderPlacedMessage, { timeout: 10000 });
      console.log('✓ Order placed successfully');

      // 16: Click 'Delete Account' button
      await page.click(selectors.deleteAccountButton);

      // 17: Verify 'ACCOUNT DELETED!' and click 'Continue' button
      await page.waitForSelector(selectors.accountDeletedText, { timeout: 10000 });
      await page.click(selectors.continueButton);
      console.log('✓ Account deleted');

    } catch (error) {
      await takeFailureScreenshot(page, 'place-order-login-before-checkout');
      throw error;
    }
  });
});