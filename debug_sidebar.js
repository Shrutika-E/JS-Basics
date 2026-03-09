const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com');
  await page.click('a[href="/products"]');
  const html = await page.$eval('.left-sidebar .category-products', el=>el.innerHTML);
  fs.writeFileSync('sidebar.html', html);
  await browser.close();
})();
