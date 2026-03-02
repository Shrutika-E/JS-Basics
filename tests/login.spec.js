const { test, expect } = require('@playwright/test');
const userData = require('./helpers/userData');
const common = require('./helpers/common');
const nav = require('./helpers/navigation');
const selectors = require('./helpers/selectors');


test.describe('Login with valid credentials', () => {
  test('should register a new user, logout, login and delete account', async ({ page }) => {
    test.setTimeout(180000);

    // prepare user and save to JSON for later reference
    const user = userData.generateUser();
    userData.saveUser(user);

    // 1‑3: launch, verify home and register account
    await nav.gotoHome(page);
    await page.waitForSelector(selectors.homeHeading, { state: 'visible', timeout: 10000 }).catch(() => {});

    await common.registerUser(page, user);
    await expect(page.locator(selectors.loggedInText)).toContainText(user.name, { timeout: 10000 });

    // logout then login to verify credentials
    await common.logout(page);
    await common.loginUser(page, user);
    await expect(page.locator(selectors.loggedInText)).toContainText(user.name, { timeout: 10000 });

    // clean up
    await common.deleteUser(page);
    await expect(page.locator(selectors.accountDeletedText)).toBeVisible({ timeout: 10000 });
  });
});
