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
}
)
