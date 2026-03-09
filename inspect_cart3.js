const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/products', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.hover('.features_items .product-image-wrapper');
  await page.click('.features_items .product-image-wrapper a:has-text("Add to cart")');
  await page.waitForTimeout(1000);
  await page.click('text=Continue Shopping');
  await page.goto('https://automationexercise.com/view_cart', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const rows = await page.$$eval('table.cart_info tbody tr', els => els.map(el => el.innerHTML));
  console.log('rows html', rows);
  await browser.close();
})();