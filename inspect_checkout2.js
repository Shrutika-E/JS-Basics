const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/view_cart', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const link = await page.$('a:has-text("Proceed To Checkout")');
  if (link) {
    console.log('href', await link.getAttribute('href'));
  }
  await browser.close();
})();