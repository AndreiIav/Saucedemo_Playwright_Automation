import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { HeaderPage } from './pages/HeaderPage';


test('Item can be added to cart', async ({ page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    const item = await inventoryPage.addItemToCart(testItemName);
    const itemRemoveButton = inventoryPage.getItemButton(item, "Remove");

    expect(page.getByTestId(itemRemoveButton)).toBeEnabled();
    expect(await headerPage.getShoppingCartCount()).toBe('1');

});

test('Item can be removed from cart', async ({ page }) => {
    const testItemName = 'Test.allTheThings() T-Shirt (Red)';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    // add item to cart
    const item = await inventoryPage.addItemToCart(testItemName);
    const itemAddButton = inventoryPage.getItemButton(item, "addToCart");
    // remove item from cart
    await inventoryPage.removeItemFromCart(testItemName);

    expect(page.getByTestId(itemAddButton)).toBeEnabled();
    expect(headerPage.shoppingCartBadge).toBeHidden();
});

test('User can log out', async ({ page }) => {
    const logInURL = 'https://www.saucedemo.com/'
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    await headerPage.logOut();

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
            const headerPage = new HeaderPage(page);

            await inventoryPage.goto();
            await headerPage.selectSortOption(sortOption);
            const sortText = await headerPage.getSortActiveOption();

            expect(sortText).toBe(expectedSortText);
        });

});

test('Items are sorted A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    const itemNames = await inventoryPage.getNameOfAllItemsOnPage();
    await headerPage.selectSortOption('az');
    const itemNamesSorted = await inventoryPage.getNameOfAllItemsOnPage();
    itemNames.sort();

    expect(itemNames).toEqual(itemNamesSorted);

});

test('Items are sorted Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    const itemNames = await inventoryPage.getNameOfAllItemsOnPage();
    await headerPage.selectSortOption('za');
    const itemNamesSorted = await inventoryPage.getNameOfAllItemsOnPage();
    itemNames.sort().reverse();

    expect(itemNames).toEqual(itemNamesSorted);
});

test('Items are sorted by Price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    const itemPrices = await inventoryPage.getPriceOfAllItemsOnPage();
    await headerPage.selectSortOption('lohi');
    const itemPricesSorted = await inventoryPage.getPriceOfAllItemsOnPage();
    itemPrices.sort((a, b) => a - b);

    expect(itemPrices).toEqual(itemPricesSorted);
});

test('Items are sorted by Price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    const itemPrices = await inventoryPage.getPriceOfAllItemsOnPage();
    await headerPage.selectSortOption('hilo');
    const itemPricesSorted = await inventoryPage.getPriceOfAllItemsOnPage();
    itemPrices.sort((a, b) => b - a);

    expect(itemPrices).toEqual(itemPricesSorted);
});