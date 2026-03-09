const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Test Case 23: Verify address details in checkout page

test.describe('Test Case 23 - Verify Address Details in Checkout Page', () => {
  test('should verify delivery and billing address in checkout', async ({ page }) => {
    // 1-3: Launch and verify home
    await common.verifyHome(page);

    // 4-7: Signup and create account
    await page.click(selectors.signupLoginLinkText);
    await expect(page).toHaveURL(/login/);
    await page.fill(selectors.namePlaceholder, 'Test User');
    await page.fill(selectors.signupEmail, `testuser${Date.now()}@example.com`);
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

    // 8-10: Add products to cart
    await page.click(selectors.productsLink);
    await page.click(selectors.firstProductAddToCart);
    // sometimes a modal appears, but clicking cart link is more reliable
    await page.click(selectors.cartLink);
    await expect(page).toHaveURL(/view_cart/);

    // 11: Click Proceed To Checkout (wait for button visible)
    await page.waitForSelector(selectors.proceedToCheckoutButton, { state: 'visible' });
    await page.click(selectors.proceedToCheckoutButton);

    // 12-13: Verify delivery and billing address
    // Assuming the address is displayed in the checkout page
    const deliveryAddress = await page.locator('.address_delivery').textContent();
    const billingAddress = await page.locator('.address_billing').textContent();
    expect(deliveryAddress).toContain('Test User');
    expect(deliveryAddress).toContain('123 Test St');
    expect(billingAddress).toContain('Test User');
    expect(billingAddress).toContain('123 Test St');

    // 14-15: Delete account
    await page.click(selectors.deleteAccountButton);
    await expect(page.locator(selectors.accountDeletedText)).toBeVisible();
    await page.click(selectors.continueButton);
  });
});