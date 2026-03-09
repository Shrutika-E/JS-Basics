const { chromium } = require('playwright');
(async()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForSelector('.recommended_items');
  const html = await page.$eval('.recommended_items', el=>el.innerHTML);
  console.log('RECOMMENDED HTML:', html);
  const items = await page.$$('.recommended_items .item');
  console.log('items count', items.length);
  for(let i=0;i<items.length;i++){
    const text = await items[i].textContent();
    console.log('item', i, text.trim().replace(/\s+/g,' '));
  }
  await browser.close();
})();
