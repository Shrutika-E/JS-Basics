const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/products', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  // add first product
  await page.click('.features_items .product-image-wrapper a:has-text("Add to cart")');
  await page.waitForTimeout(1000);
  await page.click('text=Continue Shopping');
  await page.goto('https://automationexercise.com/view_cart', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const rows = await page.$$eval('table.cart_info tbody tr', els => els.map(el => ({text: el.textContent.replace(/\s+/g,' ').trim()})));
  console.log(rows);
  await browser.close();
})();