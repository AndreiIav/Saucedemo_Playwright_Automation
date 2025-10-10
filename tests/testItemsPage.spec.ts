import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage'


test('Item can be added to cart', async ({ page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    //add item to cart
    const item = await inventoryPage.getOneItemByName(testItemName);
    const itemRemoveButton = await inventoryPage.getItemButton(item, "Remove");
    await inventoryPage.addItemToCart(item);

    expect(page.getByTestId(itemRemoveButton)).toBeEnabled();
    expect(await inventoryPage.getShoppingCartCount()).toBe('1');

});

test('Item can be removed from cart', async ({ page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    //add item to cart
    const item = await inventoryPage.getOneItemByName(testItemName);
    const itemRemoveButton = await inventoryPage.getItemButton(item, 'Remove');
    const itemAddButton = await inventoryPage.getItemButton(item, 'addToCart');
    await inventoryPage.addItemToCart(item);
    expect(page.getByTestId(itemRemoveButton)).toBeEnabled();
    expect(await inventoryPage.getShoppingCartCount()).toBe('1');
    // remove item from cart
    await inventoryPage.removeItemFromCart(item);

    expect(page.getByTestId(itemAddButton)).toBeEnabled();
});

test('User can log out', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const logInURL = 'https://www.saucedemo.com/'

    await inventoryPage.goto();
    await inventoryPage.logOut();

    await expect(page).toHaveURL(logInURL);
});


[
    {
        sortOption: 'za',
        expectedSortText: 'Name (Z to A)'
    },
    {
        sortOption: 'az',
        expectedSortText: 'Name (A to Z)'
    },
    {
        sortOption: 'lohi',
        expectedSortText: 'Price (low to high)'
    },
    {
        sortOption: 'hilo',
        expectedSortText: 'Price (high to low)'
    }
].forEach(({ sortOption, expectedSortText }) => {
    test(`Sort text '${expectedSortText}' updates when the option is selected`,
        async ({ page }) => {
            const inventoryPage = new InventoryPage(page);

            await inventoryPage.goto();
            await inventoryPage.selectSortOption(sortOption);

            const sortText = await inventoryPage.getSortActiveOption();
            await page.waitForTimeout(1000);
            expect(sortText).toBe(expectedSortText);
        });

});

