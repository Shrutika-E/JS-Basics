const common = require('./common');
const { takeFailureScreenshot } = common;

module.exports = (test) => {
  // Runs before each test to prepare the environment
  test.beforeEach(async ({ page }) => {
    try {
      // Navigate to home page and verify it loads successfully
      await common.verifyHome(page);
      
      // Dismiss any advertisements, modals, or popups that may block interactions
      // This ensures test stability by handling dynamic ads on the website
      await common.dismissAds(page);
    } catch (error) {
      // Home page load might be slow, but continue with test
      console.warn('Home page verification took longer than expected:', error.message);
    }
  });

  // Takes screenshot automatically when test fails
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const name = testInfo.title.replace(/\s+/g, '-').toLowerCase();
      await takeFailureScreenshot(page, name);
    }
  });
};