module.exports = {
  gotoHome: async (page) => {
    await page.goto('http://automationexercise.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
  },
  gotoSignup: async (page) => {
    // Directly navigate to login/signup page for stability
    await page.goto('http://automationexercise.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
  }
};
