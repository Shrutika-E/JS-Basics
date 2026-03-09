const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/view_cart', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const rows = await page.$$eval('table.cart_info tbody tr', els => els.map(el => ({text: el.textContent.replace(/\s+/g,' ').trim()})));
  console.log(rows);
  await browser.close();
})();