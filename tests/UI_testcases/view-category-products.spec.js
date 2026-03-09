const { test, expect } = require('@playwright/test');
const common = require('../helpers/common');
const selectors = require('../helpers/selectors');
const registerHooks = require('../helpers/hooks');
registerHooks(test);

// Test Case 18: View Category Products

test.describe('Test Case 18 - View Category Products', () => {
  test('should navigate categories on left sidebar', async ({ page }) => {
    // 1-3: go to products page
    await common.verifyHome(page);
    await page.click(selectors.productsLink);
    await expect(page.locator(selectors.categoriesSection)).toBeVisible();

    // 4-6: Women -> Dress
    // expand women panel then click dress link
    await page.click(selectors.categoryWomen, { force: true });
    await page.evaluate(() => document.querySelector('#Women').classList.add('in'));
    await page.waitForSelector(selectors.categoryDress, { state: 'visible', timeout: 5000 });
    await page.click(selectors.categoryDress);
    // confirm navigation and heading text
    await page.waitForURL(/category_products\/[0-9]+/);
    await expect(page.locator(selectors.categoryPageHeading)).toContainText(/Women\s*-\s*Dress/i,{ timeout: 10000 });

    // 7-8: Men subcategory
    await page.click(selectors.categoryMen, { force: true });
    await page.evaluate(() => document.querySelector('#Men').classList.add('in'));
    await page.waitForSelector(selectors.categoryMenSub, { state: 'visible', timeout: 5000 });
    await page.click(selectors.categoryMenSub);
    await expect(page.locator(selectors.categoryPageHeading)).toContainText(/Men/i);
  });
});