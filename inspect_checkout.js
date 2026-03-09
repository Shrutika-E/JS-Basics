const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/products', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  // add first product
  await page.hover('.features_items .product-image-wrapper');
  await page.click('.features_items .product-image-wrapper a:has-text("Add to cart")');
  await page.waitForTimeout(1000);
  await page.click('text=View Cart');
  await page.waitForTimeout(2000);
  // proceed to checkout
  await page.click('a:has-text("Proceed To Checkout")');
  await page.waitForTimeout(2000);
  console.log('url', page.url());
  const html = await page.content();
  console.log(html.slice(0,2000));
  await browser.close();
})();