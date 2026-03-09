const { test, expect } = require('@playwright/test');
const userData = require('../helpers/userData');
const common = require('../helpers/common');
const { takeFailureScreenshot } = common;
const nav = require('../helpers/navigation');
const selectors = require('../helpers/selectors');
const fs = require('fs');
const path = require('path');
const registerHooks = require('../helpers/hooks');
registerHooks(test);


test.describe('Contact Us Form', () => {
  test('should submit contact us form successfully', async ({ page }) => {
    test.setTimeout(180000);

    // Create a sample text file for upload
    const testFileName = 'test-file.txt';
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for contact us form submission.');

    try {
      // Prerequisite: Register a user
      const user = userData.generateUser();
      userData.saveUser(user);

      // Step 1 & 2: Launch browser and navigate to home page
      await nav.gotoHome(page);
      console.log('✓ Navigated to home page');

      // Step 3: Verify that home page is visible successfully
      try {
        await page.waitForSelector(selectors.homeHeading, { state: 'visible', timeout: 10000 });
        console.log('✓ Home page is visible');
      } catch (error) {
        await takeFailureScreenshot(page, 'home-page-not-visible');
        throw new Error('Home page heading not visible: ' + error.message);
      }

      // Step 4: Click on 'Contact Us' button
      try {
        const contactUsSelector = `a:has-text("Contact Us")`;
        await page.locator(contactUsSelector).click({ timeout: 10000 });
        console.log('✓ Clicked on Contact Us button');
      } catch (error) {
        await takeFailureScreenshot(page, 'contact-us-button-not-found');
        throw new Error('Contact Us button not found: ' + error.message);
      }

      // Wait for page to load
      await page.waitForLoadState('domcontentloaded');

      // Step 5: Verify 'GET IN TOUCH' is visible
      try {
        await page.waitForSelector(selectors.getTouchHeading, { state: 'visible', timeout: 10000 });
        await expect(page.locator(selectors.getTouchHeading)).toBeVisible();
        console.log('✓ GET IN TOUCH heading is visible');
      } catch (error) {
        await takeFailureScreenshot(page, 'get-in-touch-not-visible');
        throw new Error('GET IN TOUCH heading not visible: ' + error.message);
      }

      // Step 6: Enter name, email, subject and message
      const contactData = {
        name: user.name,
        email: user.email,
        subject: 'Testing Contact Us Form',
        message: 'This is a test message to verify the contact us form automation.',
        filePath: testFilePath
      };

      // Wait for form fields to be visible
      try {
        await page.waitForSelector(selectors.contactNameInput, { state: 'visible', timeout: 10000 });
        console.log('✓ Contact form is visible');
      } catch (error) {
        await takeFailureScreenshot(page, 'contact-form-not-visible');
        throw new Error('Contact form fields not visible: ' + error.message);
      }

      // Step 7: Submit contact form
      try {
        await common.submitContactUs(page, contactData);
        console.log('✓ Contact form submitted');
      } catch (error) {
        await takeFailureScreenshot(page, 'contact-form-submit-error');
        throw new Error('Failed to submit contact form: ' + error.message);
      }

      // Step 8 & 9: Handle OK button and verify success message
      try {
        await expect(page.locator(selectors.contactSuccessMessage)).toBeVisible({ timeout: 10000 });
        console.log('✓ Success message is visible');
      } catch (error) {
        await takeFailureScreenshot(page, 'success-message-not-found');
        throw new Error('Success message not visible: ' + error.message);
      }

    } catch (error) {
      // Take final screenshot on failure
      await takeFailureScreenshot(page, 'contact-us-test-final-failure');
      console.error('✗ Test failed');
      console.error('Error:', error.message);
      throw error;
    } finally {
      // Cleanup: Remove test file
      try {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      } catch (cleanupError) {
        console.warn('Could not delete test file:', cleanupError.message);
      }
    }
  });
});

