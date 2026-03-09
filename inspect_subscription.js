const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const sub = await page.$$eval('footer *', els => els.map(el => ({tag: el.tagName, class: el.className, text: el.textContent.trim().slice(0,50)})).filter(x=>x.text));
  console.log(sub.slice(0,50));
  await browser.close();
})();