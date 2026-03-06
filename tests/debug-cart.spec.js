const { test } = require('@playwright/test');
const common = require('./helpers/common');
const { takeFailureScreenshot } = common;
const registerHooks = require('./helpers/hooks');
registerHooks(test);

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const name = testInfo.title.replace(/\s+/g, '-').toLowerCase();
    await takeFailureScreenshot(page, name);
  }
});

test('debug cart structure', async ({ page }) => {
  await page.goto('https://automationexercise.com/products', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  // hover first product
  const first = page.locator('.features_items .product-image-wrapper').first();
  await first.hover();
  await page.click('.features_items .product-image-wrapper a:has-text("Add to cart")');
  await page.waitForTimeout(1000);
  await page.click('text=Continue Shopping');
  await page.goto('https://automationexercise.com/view_cart', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const html = await page.content();
  console.log('CART PAGE HTML', html.substring(0,1000));
});