const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
  const browser = await chromium.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector('.recommended_items .item.active a.add-to-cart');
  await page.click('.recommended_items .item.active a.add-to-cart');
  await page.waitForResponse(r=>r.url().includes('/add_to_cart/') && r.status()===200);
  await page.click('a:has-text("View Cart")');
  await page.waitForURL(/view_cart/);
  const html = await page.content();
  fs.writeFileSync('cartpage.html', html);
  console.log('cart page saved');
  await browser.close();
})();
