const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/product_details/1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const inputAttrs = await page.$$eval('#quantity', els => els.map(el => ({type: el.type, value: el.value, id: el.id, name: el.name, class: el.className}))); 
  console.log(inputAttrs);
  await browser.close();
})();