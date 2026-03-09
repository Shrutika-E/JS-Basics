const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/product_details/1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const info = await page.$$eval('div.product-information *', els => els.map(el => ({tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0,40)})).filter(x=>x.text));
  console.log(info);
  await browser.close();
})();