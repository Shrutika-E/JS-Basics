const { chromium } = require('playwright');
(async()=>{
  const browser = await chromium.launch({headless:false});
  const page = await browser.newPage();
  page.on('request', request => {
    if(request.url().includes('add_to_cart')){
      console.log('request', request.url(), request.method(), request.postData());
    }
  });
  page.on('response', response => {
    if(response.url().includes('add_to_cart')){
      console.log('response', response.status());
    }
  });
  await page.goto('https://automationexercise.com');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector('.recommended_items .item.active a.add-to-cart');
  await page.click('.recommended_items .item.active a.add-to-cart');
  await page.waitForTimeout(3000);
  await browser.close();
})();
