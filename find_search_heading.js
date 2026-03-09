const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/products', { waitUntil: 'domcontentloaded' });
  await page.fill('#search_product', 'Dress');
  await page.click('#submit_search');
  await page.waitForTimeout(2000);
  const heading = await page.$eval('div.features_items h2.title', el => el.textContent.trim());
  console.log('heading:', heading);
  await browser.close();
})();