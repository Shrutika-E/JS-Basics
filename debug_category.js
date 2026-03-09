const { chromium } = require('playwright');
(async()=>{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com');
  await page.click('a[href="/products"]');
  await page.click('a[href="#Women"]');
  await page.click('a[href="/category_products/1"]');
  const heading = await page.locator('h2.title.text-center').textContent();
  console.log('heading after women dress:', heading);
  await page.click('a[href="#Men"]');
  await page.click('a[href="/category_products/3"]');
  const heading2 = await page.locator('h2.title.text-center').textContent();
  console.log('heading after men sub:', heading2);
  await browser.close();
})();
