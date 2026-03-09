const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/view_cart', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const headings = await page.$$eval('h2,h1', els => els.map(el => el.textContent.trim()));
  console.log(headings);
  await browser.close();
})();