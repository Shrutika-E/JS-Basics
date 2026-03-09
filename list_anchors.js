const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://automationexercise.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const anchors = await page.$$eval('a', els => els.map(el => ({text: el.textContent.trim(), href: el.href, class: el.className})).filter(a => a.text !== ''));
  console.log(anchors);
  await browser.close();
})();