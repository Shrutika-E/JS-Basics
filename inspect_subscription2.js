const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const inputs = await page.$$eval('footer form.searchform input', els => els.map(el => ({type: el.type, name: el.name, placeholder: el.placeholder, id: el.id, class: el.className}))); 
  console.log(inputs);
  const buttons = await page.$$eval('footer form.searchform button', els => els.map(el => ({type: el.type, text: el.textContent.trim(), class: el.className}))); 
  console.log(buttons);
  await browser.close();
})();