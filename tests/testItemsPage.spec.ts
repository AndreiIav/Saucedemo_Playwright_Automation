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

            expect(sortText).toBe(expectedSortText);
        });

});

test('Items are sorted A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    const itemNames = await inventoryPage.getNameOfAllItemsOnPage();
    await inventoryPage.selectSortOption('az');
    const itemNamesSorted = await inventoryPage.getNameOfAllItemsOnPage();
    itemNames.sort();

    expect(itemNames).toEqual(itemNamesSorted);

});

test('Items are sorted Z to A', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    const itemNames = await inventoryPage.getNameOfAllItemsOnPage();
    await inventoryPage.selectSortOption('za');
    const itemNamesSorted = await inventoryPage.getNameOfAllItemsOnPage();
    itemNames.sort().reverse();

    expect(itemNames).toEqual(itemNamesSorted);
});

test('Items are sorted by Price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    const itemPrices = await inventoryPage.getPriceOfAllItemsOnPage();
    await inventoryPage.selectSortOption('lohi');
    const itemPricesSorted = await inventoryPage.getPriceOfAllItemsOnPage();
    itemPrices.sort((a, b) => a - b);

    expect(itemPrices).toEqual(itemPricesSorted);
});

test('Items are sorted by Price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    const itemPrices = await inventoryPage.getPriceOfAllItemsOnPage();
    await inventoryPage.selectSortOption('hilo');
    const itemPricesSorted = await inventoryPage.getPriceOfAllItemsOnPage();
    itemPrices.sort((a, b) => b - a);

    expect(itemPrices).toEqual(itemPricesSorted);
});