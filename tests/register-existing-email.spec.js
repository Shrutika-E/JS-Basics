const { test, expect } = require('@playwright/test');
const userData = require('./helpers/userData');
const common = require('./helpers/common');
const nav = require('./helpers/navigation');
const selectors = require('./helpers/selectors');

test.describe('Register with existing email', () => {
  test('should show error when registering with an already used email', async ({ page }) => {
    test.setTimeout(90000);

    // prereq: register a fresh user so the email definitely exists
    await nav.gotoHome(page);
    const existing = userData.generateUser();
    await common.registerUser(page, existing);
    // logout so we can attempt another signup
    await common.logout(page);
    await nav.gotoSignup(page);

    // Wait for signup form
    await page.waitForSelector(selectors.signupEmail, { state: 'visible', timeout: 10000 }).catch(() => {});

    // Fill name + the same email
    let nameInput = page.locator(selectors.namePlaceholder).first();
    if (!await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      nameInput = page.locator(selectors.nameFieldAlt).first();
    }
    const newName = `dup_${Date.now()}`;
    await nameInput.fill(newName);
    await page.locator(selectors.signupEmail).fill(existing.email);

    // Submit signup
    await page.locator(selectors.signupButton).click();

    // Verify error appears - try several common variants and a flexible XPath
    const variants = [
      'text=Email Address already exist!',
      'text=Email Address already exists!',
      'text=Email Already Exist!',
      'text=Email Already Exists!',
      'xpath=//*[contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "email") and (contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "already") or contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "exist") or contains(translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "exists"))]'
    ];

    let found = null;
    try {
      const waits = variants.map(sel =>
        page.waitForSelector(sel, { state: 'visible', timeout: 10000 }).then(() => sel)
      );
      found = await Promise.any(waits);
    } catch (e) {
      // nothing found
    }

    if (!found) {
      throw new Error('Email already exists error message not found');
    }

    const txt = (await page.locator(found).textContent()) || '';
    expect(txt.toLowerCase()).toContain('email');
  });
});
