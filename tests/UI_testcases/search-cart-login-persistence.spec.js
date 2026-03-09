const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const userData = require('../helpers/userData');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Search and cart persistence after login

test.describe('Search & Cart Persistence', () => {
  test('search products, add to cart then login and verify cart retains items', async ({ page }) => {
    test.setTimeout(180000);
    // prereq: create a user that will be used later
    const user = userData.generateUser();
    userData.saveUser(user);
    await common.registerUser(page, user);
    await common.logout(page);

    // 1-4: Go to products page
    await common.verifyHome(page);
    await page.click(selectors.productsLink);
    await expect(page.locator(selectors.productsHeading)).toBeVisible();

    // 5-7: search
    const searchTerm = 'Dress';
    await page.fill(selectors.productSearchInput, searchTerm);
    await page.click(selectors.productSearchButton);
    await expect(page.locator(selectors.searchedProductsHeading)).toHaveText(/Searched Products/i);
    const results = await page.locator(selectors.firstProductAddToCart).count();
    expect(results).toBeGreaterThan(0);

    // 8: add all results to cart
    for (let i = 0; i < results; i++) {
      const btn = page.locator(selectors.firstProductAddToCart).nth(i);
      await btn.click();
      await page.waitForSelector('text=Continue Shopping', { timeout: 5000 });
      await page.click('text=Continue Shopping');
      await page.waitForLoadState('networkidle').catch(() => {});
    }

    // 9: open cart and verify count
    await page.click(selectors.cartLink);
    const beforeLoginCount = await page.locator(selectors.cartTableRows).count();
    expect(beforeLoginCount).toBeGreaterThan(0);

    // 10: login
    await page.click(selectors.signupLoginLinkText);
    await page.fill(selectors.loginEmail, user.email);
    await page.fill(selectors.loginPassword, user.password);
    await page.click(selectors.loginButton);

    // 11: go back to cart
    await page.click(selectors.cartLink);
    const afterLoginCount = await page.locator(selectors.cartTableRows).count();

    // 12: verify counts are equal
    expect(afterLoginCount).toBe(beforeLoginCount);
  });
});