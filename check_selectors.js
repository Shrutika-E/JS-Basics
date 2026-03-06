const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://automationexercise.com/contact_us');
  await page.waitForLoadState('domcontentloaded');

  // Check if textarea exists
  const textarea = page.locator('textarea');
  const count = await textarea.count();
  console.log('Number of textareas:', count);

  if (count > 0) {
    const placeholder = await textarea.first().getAttribute('placeholder');
    console.log('Textarea placeholder:', placeholder);
  }

  // Check all inputs and textareas
  const inputs = page.locator('input, textarea');
  const inputCount = await inputs.count();
  console.log('Total inputs and textareas:', inputCount);

  for (let i = 0; i < inputCount; i++) {
    const tag = await inputs.nth(i).evaluate(el => el.tagName);
    const placeholder = await inputs.nth(i).getAttribute('placeholder');
    const name = await inputs.nth(i).getAttribute('name');
    console.log(`${tag} - placeholder: ${placeholder}, name: ${name}`);
  }

  await browser.close();
})();