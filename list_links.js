const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://automationexercise.com', { waitUntil: 'domcontentloaded' });
  const links = await page.$$eval('nav a', els => els.map(el => ({text: el.textContent.trim(), href: el.href})));
  console.log(links);
  await browser.close();
})();