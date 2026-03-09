const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Test Case 24: Download Invoice after purchase order

test.describe('Test Case 24 - Download Invoice after Purchase Order', () => {
  test('should download invoice after placing order', async ({ page }) => {
    // 1-3: Launch and verify home
    await common.verifyHome(page);

    // 4-6: Add products to cart
    await page.click(selectors.productsLink);
    await page.click(selectors.firstProductAddToCart);
    await page.click(selectors.recommendedViewCartButton);
    await expect(page).toHaveURL(/view_cart/);

    // 7: Click Proceed To Checkout
    await page.click(selectors.proceedToCheckoutButton);

    // 8: Click Register / Login
    await page.click(selectors.registerLoginButton);

    // 9-11: Fill signup and create account
    await page.fill(selectors.namePlaceholder, 'Test User');
    await page.fill(selectors.signupEmail, `testuser2${Date.now()}@example.com`);
    await page.click(selectors.signupButton);
    await expect(page.locator(selectors.accountInfoText)).toBeVisible();
    // Fill account details
    await page.fill(selectors.passwordInput, 'password123');
    await page.selectOption(selectors.daysSelect, '1');
    await page.selectOption(selectors.monthsSelect, '1');
    await page.selectOption(selectors.yearsSelect, '1990');
    await page.check(selectors.newsletterCheckbox);
    await page.check(selectors.optinCheckbox);
    await page.fill(selectors.firstName, 'Test');
    await page.fill(selectors.lastName, 'User');
    await page.fill(selectors.company, 'Test Company');
    await page.fill(selectors.address, '123 Test St');
    await page.fill(selectors.address2, 'Apt 4');
    await page.selectOption(selectors.countrySelect, 'United States');
    await page.fill(selectors.stateInput, 'Test State');
    await page.fill(selectors.cityInput, 'Test City');
    await page.fill(selectors.zipcodeInput, '12345');
    await page.fill(selectors.mobileInput, '1234567890');
    await page.click(selectors.createAccountButton);
    await expect(page.locator(selectors.accountCreatedText)).toBeVisible();
    await page.click(selectors.continueButton);
    await expect(page.locator(selectors.loggedInText)).toContainText('Test User');

    // 12-13: Click Cart, Proceed To Checkout
    await page.click(selectors.cartLink);
    await page.click(selectors.proceedToCheckoutButton);

    // 14: Verify Address Details and Review Your Order
    await expect(page.locator(selectors.addressDetailsHeading)).toBeVisible();
    await expect(page.locator(selectors.reviewOrderHeading)).toBeVisible();

    // 15: Enter comment and Place Order
    await page.fill(selectors.commentTextArea, 'Test comment');
    await page.click(selectors.placeOrderButton);

    // 16-17: Enter payment and confirm
    await page.fill(selectors.nameOnCardInput, 'Test User');
    await page.fill(selectors.cardNumberInput, '4111111111111111');
    await page.fill(selectors.cvcInput, '123');
    await page.fill(selectors.expiryMonthInput, '12');
    await page.fill(selectors.expiryYearInput, '2025');
    await page.click(selectors.payAndConfirmButton);

    // 18: Verify success message
    await expect(page.locator(selectors.orderPlacedMessage)).toBeVisible();

    // 19: Click Download Invoice and verify download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(selectors.downloadInvoiceButton)
    ]);
    expect(download.suggestedFilename()).toBe('invoice.txt'); // assuming it's invoice.txt

    // 20: Click Continue
    await page.click(selectors.continueButton);

    // 21-22: Delete account
    await page.click(selectors.deleteAccountButton);
    await expect(page.locator(selectors.accountDeletedText)).toBeVisible();
    await page.click(selectors.continueButton);
  });
});