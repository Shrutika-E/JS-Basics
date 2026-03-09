const { chromium } = require('playwright');
(async()=>{
  const browser = await chromium.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector('.recommended_items .item.active a.add-to-cart');
  await page.click('.recommended_items .item.active a.add-to-cart');
  await page.waitForTimeout(2000);
  const body = await page.content();
  console.log('body snippet:', body.slice(0,2000));
  await browser.close();
})();
