const selectors = require('./selectors');
const nav = require('./navigation');

async function registerUser(page, user) {
  // navigate to signup/login page
  await nav.gotoSignup(page);

  // ensure form ready
  await page.waitForSelector(selectors.signupEmail, { state: 'visible', timeout: 10000 }).catch(() => {});

  // fill name and email
  let nameInput = page.locator(selectors.namePlaceholder).first();
  if (!await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    nameInput = page.locator(selectors.nameFieldAlt).first();
  }
  await nameInput.fill(user.name);
  await page.locator(selectors.signupEmail).fill(user.email);
  await page.locator(selectors.signupButton).click();

  // wait for account information section
  await page.waitForSelector(selectors.passwordInput, { state: 'visible', timeout: 10000 }).catch(() => {});

  // fill password
  await page.locator(selectors.passwordInput).fill(user.password);

  // date of birth
  await page.selectOption(selectors.daysSelect, '15').catch(() => {});
  await page.selectOption(selectors.monthsSelect, { label: 'January' }).catch(() => {});
  await page.selectOption(selectors.yearsSelect, '1990').catch(() => {});

  // check boxes if present
  await page.locator(selectors.newsletterCheckbox).check().catch(() => {});
  await page.locator(selectors.optinCheckbox).check().catch(() => {});

  // fill remaining personal details
  await page.locator(selectors.firstName).fill(user.firstName);
  await page.locator(selectors.lastName).fill(user.lastName);
  await page.locator(selectors.company).fill(user.company);
  await page.locator(selectors.address).fill(user.address);
  await page.locator(selectors.address2).fill(user.address2);
  await page.selectOption(selectors.countrySelect, { label: user.country }).catch(() => {});
  await page.locator(selectors.stateInput).fill(user.state);
  await page.locator(selectors.cityInput).fill(user.city);
  await page.locator(selectors.zipcodeInput).fill(user.zipcode);
  await page.locator(selectors.mobileInput).fill(user.mobile);

  // submit create account
  await page.locator(selectors.createAccountButton).click();

  // wait for creation and click continue if needed
  try {
    await page.waitForSelector(selectors.accountCreatedText, { state: 'visible', timeout: 15000 });
  } catch {
    // nothing, maybe it already exists
  }
  await page.locator(selectors.continueButton).click().catch(() => {});
}

async function loginUser(page, user) {
  await nav.gotoSignup(page);
  await page.waitForSelector(selectors.loginPageHeader, { state: 'visible', timeout: 8000 });
  await page.fill(selectors.loginEmail, user.email);
  await page.fill(selectors.loginPassword, user.password);
  await page.click(selectors.loginButton);
}

async function logout(page) {
  try {
    await page.click(selectors.logoutLink, { timeout: 5000 });
  } catch {
    await page.click('//a[contains(text(),"Logout")]', { timeout: 5000 }).catch(() => {});
  }
}

async function deleteUser(page) {
  try {
    await page.click(selectors.deleteHref, { timeout: 5000 });
  } catch {
    try {
      await page.click(selectors.deleteTextXPath, { timeout: 5000 });
    } catch {
      await page.click(selectors.deleteHasText, { timeout: 5000 }).catch(() => {});
    }
  }
  // wait for deletion confirmation
  await page.waitForSelector(selectors.accountDeletedText, { state: 'visible', timeout: 10000 }).catch(() => {});
}

module.exports = { registerUser, loginUser, logout, deleteUser };