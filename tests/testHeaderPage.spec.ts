import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { HeaderPage } from './pages/HeaderPage';

test('User can log out', async ({ page }) => {
    const logInURL = 'https://www.saucedemo.com/'
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    await headerPage.logOut();

    await expect(page).toHaveURL(logInURL);
});

test('Inventory Page name is "Products"', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);
    const expectedPageName = 'Products';

    await inventoryPage.goto();

    expect(await headerPage.getPageTitle()).toBe(expectedPageName);
});
