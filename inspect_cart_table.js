const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/product_details/1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  // increase quantity to 4
  await page.fill('#quantity', '4');
  // add to cart
  await page.click('button:has-text("Add to cart")');
  await page.waitForTimeout(1000);
  await page.click('text=Continue Shopping');
  await page.goto('https://automationexercise.com/view_cart', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const tables = await page.$$eval('table', tables => tables.map(t => t.outerHTML));
  console.log('ALL TABLES:', tables);
  if (tables.length === 0) {
    console.log('No tables found. Page body:', await page.$eval('body', el => el.innerHTML));
  }
  await browser.close();
})();