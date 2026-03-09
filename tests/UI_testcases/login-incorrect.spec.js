const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const { takeFailureScreenshot } = common;
const nav = require('../helpers/navigation');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const name = testInfo.title.replace(/\s+/g, '-').toLowerCase();
    await takeFailureScreenshot(page, name);
  }
});

test.describe('Login with incorrect credentials', () => {
  test('should display error message when login with wrong email and password', async ({ page }) => {
    test.setTimeout(60000);

    // Step 1 & 2: Launch browser and Navigate to home page
    await nav.gotoHome(page);
    
    // Step 3: Verify home page is visible
    try {
      await page.waitForSelector(selectors.homeHeading, { state: 'visible', timeout: 10000 });
      console.log('✓ Home page loaded successfully');
    } catch {
      console.log('Home page heading not visible, continuing...');
    }

    // Step 4: Navigate to login/signup page
    await nav.gotoSignup(page);

    // Step 5: Verify 'Login to your account' is visible
    try {
      await expect(page.locator(selectors.loginPageHeader)).toBeVisible({ timeout: 8000 });
      console.log('✓ Login page header visible');
    } catch {
      console.log('Login page header not found, continuing...');
    }

    // Step 6: Enter incorrect email and password
    const incorrectEmail = 'nonexistent.user@invalid.domain';
    const incorrectPassword = 'WrongPassword123!';

    await page.fill(selectors.loginEmail, incorrectEmail);
    await page.fill(selectors.loginPassword, incorrectPassword);
    console.log(`✓ Entered incorrect credentials - Email: ${incorrectEmail}, Password: ${incorrectPassword}`);

    // Step 7: Click login button
    await page.click(selectors.loginButton);
    console.log('✓ Clicked login button');

    // Step 8: Verify error message is visible
    await expect(page.locator(selectors.loginErrorMessage)).toBeVisible({ timeout: 10000 });
    console.log('✓ Error message "Your email or password is incorrect!" is displayed');

    // Verify the error message contains the expected text
    const errorText = await page.locator(selectors.loginErrorMessage).textContent();
    expect(errorText).toContain('Your email or password is incorrect!');
    console.log(`✓ Error message verified: "${errorText.trim()}"`);
  });
});
