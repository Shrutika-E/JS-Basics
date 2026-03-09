const { chromium } = require('playwright');
(async()=>{
  const browser = await chromium.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector('.recommended_items');
  await page.click('.recommended_items .item.active a.add-to-cart');
  // give time to observe
  await page.waitForTimeout(5000);
  await page.screenshot({path:'rv_recommended_click.png', fullPage:true});
  await page.click('a:has-text("View Cart")');
  await page.waitForURL(/view_cart/);
  const count = await page.locator('table.cart_info tbody tr').count();
  console.log('cart rows count', count);
  await browser.close();
})();
