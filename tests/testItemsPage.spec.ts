import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { HeaderPage } from './pages/HeaderPage';
import { ItemPage } from './pages/ItemPage';

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


test.describe('Item page tests', () => {

    test('Item page can be accessed for an Item', async ({ page }) => {
        const testItemName = 'Sauce Labs Backpack';
        const inventoryPage = new InventoryPage(page);

        await inventoryPage.goto();
        await inventoryPage.clickItemNameLink(testItemName);

        expect(page).toHaveURL(/inventory-item\.html.*/)
    })

    test('Item details match when accessing the Item page', async ({ page }) => {
        const testItemName = 'Sauce Labs Backpack';
        const inventoryPage = new InventoryPage(page);

        await inventoryPage.goto();
        const testItemCard = await inventoryPage.getOneItemByName(testItemName);
        await inventoryPage.clickItemNameLink(testItemName);
        const testClickedItemCard = await inventoryPage.getOneItemByName(testItemName);

        expect(testItemCard).toEqual(testClickedItemCard)
    });

    test('Item can be added to cart from the Item page', async ({ page }) => {
        const testItemName = 'Sauce Labs Backpack';
        const inventoryPage = new InventoryPage(page);
        const headerPage = new HeaderPage(page);
        const itemPage = new ItemPage(page);

        await inventoryPage.goto();
        await inventoryPage.clickItemNameLink(testItemName);
        await itemPage.clickAddtoCartButton();

        expect(itemPage.itemRemoveButton).toBeEnabled();
        expect(await headerPage.getShoppingCartCount()).toBe('1');
    });

    test('Item can be removed from cart from the Item page', async ({ page }) => {
        const testItemName = 'Sauce Labs Backpack';
        const inventoryPage = new InventoryPage(page);
        const headerPage = new HeaderPage(page);
        const itemPage = new ItemPage(page);

        await inventoryPage.goto();
        await inventoryPage.clickItemNameLink(testItemName);
        await itemPage.clickAddtoCartButton();
        expect(itemPage.itemRemoveButton).toBeEnabled();
        expect(await headerPage.getShoppingCartCount()).toBe('1');

        await itemPage.clickRemoveFromCartButton();
        expect(itemPage.itemAddtoCartButton).toBeEnabled();
        expect(headerPage.shoppingCartBadge).toBeHidden();
    });

    test('Can navigate to Items page from Item page', async ({ page }) => {
        const testItemName = 'Sauce Labs Onesie';
        const inventoryPage = new InventoryPage(page);
        const headerPage = new HeaderPage(page);
        const itemsPageUrl = 'https://www.saucedemo.com/inventory.html'

        await inventoryPage.goto();
        await inventoryPage.clickItemNameLink(testItemName);
        await headerPage.clickBackToProductsButton();

        expect(page).toHaveURL(itemsPageUrl);

    })

});