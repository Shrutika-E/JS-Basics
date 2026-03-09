const selectors = require('./selectors');
const nav = require('./navigation');
const fs = require('fs');
const path = require('path');

// helper for capturing screenshots on failure
async function takeFailureScreenshot(page, testName) {
  try {
    const screenshotDir = path.join(__dirname, '..', 'test-screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const timestamp = Date.now();
    const screenshotPath = path.join(screenshotDir, `${testName}-failure-${timestamp}.png`);
    if (page && !page.isClosed()) {
      try {
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.error(`✗ Test failed. Screenshot saved: ${screenshotPath}`);
        return screenshotPath;
      } catch (screenshotError) {
        console.warn('Could not take screenshot:', screenshotError.message);
      }
    }
  } catch (error) {
    console.warn('Could not take screenshot:', error.message);
  }
}

async function dismissAds(page) {
  // first remove common ad iframes that intercept pointer events
  try {
    await page.evaluate(() => {
      const selectors = [
        'iframe[id^="aswift"]',
        'iframe[src*="ads"], iframe[src*="doubleclick"]',
        'ins.adsbygoogle',
        '.adsbygoogle',
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });
    });
  } catch {
    // if evaluation fails, ignore
  }

  // Common ad and modal dismiss selectors with multiple fallbacks
  const adSelectors = [
    // Modal/Popup close buttons
    '.close-link',
    '.modal-close-button',
    '.modal-close',
    '.close',
    '.modal .close',
    '[data-dismiss="modal"]',
    '.btn-close',
    'button[aria-label="Close"]',
    'button.close',
    
    // Generic popup/advertisement close selectors
    '[class*="close"]',
    '[class*="dismiss"]',
    '[id*="close"]',
    
    // Advertisement specific
    '.ad-close',
    '.popup-close',
    '.overlay-close',
    '.advertisement-close',
    
    // XPath alternatives if needed
    '//button[contains(text(), "Close")]',
    '//a[contains(text(), "Close")]'
  ];

  let dismissedCount = 0;
  
  for (const selector of adSelectors) {
    try {
      const elements = await page.locator(selector).all();
      
      for (const element of elements) {
        // Check if element is visible before clicking
        if (await element.isVisible({ timeout: 500 }).catch(() => false)) {
          try {
            await element.click({ timeout: 2000, force: false });
            dismissedCount++;
            console.log(`✓ Dismissed advertisement/modal: ${selector}`);
            // Small delay to avoid rapid successive clicks
            await page.waitForTimeout(300);
          } catch (clickError) {
            // If regular click fails, try force click
            try {
              await element.click({ timeout: 2000, force: true });
              dismissedCount++;
              console.log(`✓ Dismissed advertisement/modal (forced): ${selector}`);
              await page.waitForTimeout(300);
            } catch {
              // Element might have been removed, continue
            }
          }
        }
      }
    } catch {
      // Selector not found or timeout, continue to next selector
    }
  }
  
  if (dismissedCount > 0) {
    console.log(`✓ Total advertisements/modals dismissed: ${dismissedCount}`);
  }
}

async function verifyHome(page) {
  await nav.gotoHome(page);
  // wait for main heading with extended timeout for slow page loads
  await page.waitForSelector(selectors.homeHeading, { state: 'visible', timeout: 15000 });
}

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

  // wait for page to load
  await page.waitForLoadState('domcontentloaded');

  // dismiss ads again
  await dismissAds(page);

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
    await page.click('//a[contains(text("Logout"))]', { timeout: 5000 }).catch(() => {});
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

async function submitContactUs(page, contactData) {
  // Fill name
  await page.locator(selectors.contactNameInput).fill(contactData.name);
  
  // Fill email
  await page.locator(selectors.contactEmailInput).fill(contactData.email);
  
  // Fill subject
  await page.locator(selectors.contactSubjectInput).fill(contactData.subject);
  
  // Fill message
  await page.locator(selectors.contactMessageTextarea).fill(contactData.message);
  
  // Upload file if provided
  if (contactData.filePath) {
    const fileInput = page.locator(selectors.contactFileInput);
    await fileInput.setInputFiles(contactData.filePath);
  }
  
  // Setup dialog handler BEFORE clicking submit button
  let dialogAccepted = false;
  const dialogHandler = async (dialog) => {
    console.log('Dialog detected:', dialog.message());
    dialogAccepted = true;
    await dialog.accept();
  };
  
  page.on('dialog', dialogHandler);
  
  try {
    // Click submit button and wait for dialog or success message
    await Promise.race([
      page.locator(selectors.contactSubmitButton).click(),
      page.waitForEvent('dialog', { timeout: 5000 }).catch(() => null)
    ]);
    
    // Wait for success message
    await page.waitForSelector(selectors.contactSuccessMessage, { state: 'visible', timeout: 10000 });
    
    if (dialogAccepted) {
      console.log('Dialog was successfully handled and accepted');
    }
  } finally {
    // Remove dialog handler
    page.removeListener('dialog', dialogHandler);
  }
}

module.exports = { registerUser, loginUser, logout, deleteUser, submitContactUs, takeFailureScreenshot, verifyHome, dismissAds };