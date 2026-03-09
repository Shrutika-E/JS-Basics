const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Test Case 19: View & Cart Brand Products

test.describe('Test Case 19 - View & Cart Brand Products', () => {
  test('should navigate between brands', async ({ page }) => {
    await common.verifyHome(page);

    // 3-4: click products and verify brands section
    await page.click(selectors.productsLink);
    await expect(page.locator(selectors.brandsSection)).toBeVisible();

    // 5-6: click first brand and verify navigation
    const firstBrand = page.locator(selectors.brandLink).first();
let brandName = (await firstBrand.textContent()).trim();       
    // strip out any leading count e.g. "(6)Polo"
    brandName = brandName.replace(/\(.*\)/, '').trim();
    await firstBrand.click();
    await expect(page.locator('h2.title.text-center')).toContainText(brandName);

    // 7-8: click second brand
    const secondBrand = page.locator(selectors.brandLink).nth(1);
    let brandName2 = (await secondBrand.textContent()).trim();     
    brandName2 = brandName2.replace(/\(.*\)/, '').trim();
    await secondBrand.click();
    await expect(page.locator('h2.title.text-center')).toContainText(brandName2);
  });
});