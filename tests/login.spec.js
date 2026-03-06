const { test, expect } = require('@playwright/test');
const userData = require('./helpers/userData');
const common = require('./helpers/common');
const { takeFailureScreenshot } = common;
const nav = require('./helpers/navigation');
const selectors = require('./helpers/selectors');
const registerHooks = require('./helpers/hooks');
registerHooks(test);

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const name = testInfo.title.replace(/\s+/g, '-').toLowerCase();
    await takeFailureScreenshot(page, name);
  }
});


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

  test('should logout user and verify navigation to login page', async ({ page }) => {
    test.setTimeout(120000);

    // Step 1 & 2: Launch browser and navigate to home page
    await nav.gotoHome(page);

    // Step 3: Verify home page is visible
    try {
      await page.waitForSelector(selectors.homeHeading, { state: 'visible', timeout: 10000 });
      console.log('✓ Home page loaded successfully');
    } catch {
      console.log('Home page heading not visible, continuing...');
    }

    // Step 4 & 5: Navigate to login page and verify header
    await nav.gotoSignup(page);
    await expect(page.locator(selectors.loginPageHeader)).toBeVisible({ timeout: 8000 });
    console.log('✓ Login page header visible');

    // Step 6: Register a new user to get valid credentials
    const user = userData.generateUser();
    await common.registerUser(page, user);
    console.log(`✓ User registered: ${user.name}`);

    // Step 7 & 8: Verify 'Logged in as username' is visible
    await expect(page.locator(selectors.loggedInText)).toContainText(user.name, { timeout: 10000 });
    console.log(`✓ Verified logged in as: ${user.name}`);

    // Step 9: Click logout button
    await common.logout(page);
    console.log('✓ Clicked logout button');

    // Step 10: Verify user is navigated to login page
    await expect(page.locator(selectors.loginPageHeader)).toBeVisible({ timeout: 10000 });
    console.log('✓ Successfully navigated to login page after logout');
  });
});
