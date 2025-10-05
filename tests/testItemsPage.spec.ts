import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage'

test('test POM', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    //log in steps
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // const res = await inventoryPage.getAllItemsOnPage();
    const res = await inventoryPage.getOneItemByName('Test.allTheThings() T-Shirt (Red)');
    expect(res).toBe('asd');

})

test('Product can be added to cart', async ({ page }) => {
    const testProductName = 'Sauce Labs Backpack';
    const inventoryPage = new InventoryPage(page);

    //log in steps
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //actual test
    const item = await inventoryPage.getOneItemByName(testProductName);
    console.log(item)
    const itemRemoveButton = await inventoryPage.getItemButton(item, "Remove");
    await inventoryPage.addItemToCart(item);

    expect(page.getByTestId(itemRemoveButton)).toBeEnabled();
    expect(await inventoryPage.getShoppingCartCount()).toBe('1');

});

test('Product can be removed from cart', async ({ page }) => {
    const testProductName = 'Sauce Labs Backpack';
    const inventoryPage = new InventoryPage(page);

    //log in steps
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    //add item to cart
    const item = await inventoryPage.getOneItemByName(testProductName);
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
