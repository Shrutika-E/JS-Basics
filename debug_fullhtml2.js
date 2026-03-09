const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
  const browser = await chromium.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector('.recommended_items .item.active a.add-to-cart');
  await page.click('.recommended_items .item.active a.add-to-cart');
  await page.waitForTimeout(2000);
  const body = await page.content();
  fs.writeFileSync('postclick.html', body);
  console.log('written');
  await browser.close();
})();
