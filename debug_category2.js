const { chromium } = require('playwright');
(async()=>{
  const browser = await chromium.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com');
  await page.click('a[href="/products"]');
  await page.click('a:has-text("Women")');
  await page.click('a:has-text("Dress")');
  console.log('current url', page.url());
  await page.waitForTimeout(3000);
  const headings = await page.$$eval('h2.title.text-center', els=>els.map(e=>e.textContent.trim()));
  console.log('headings', headings);
  await browser.close();
})();
