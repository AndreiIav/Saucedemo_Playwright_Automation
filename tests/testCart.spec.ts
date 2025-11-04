import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { HeaderPage } from './pages/HeaderPage';
import { CartPage } from './pages/CartPage';

test('Cart page can be accessed', async ({ page }) => {
  const testItemName = 'Sauce Labs Fleece Jacket';
  const expectedCartURL = 'https://www.saucedemo.com/cart.html';
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();
  await inventoryPage.addItemToCart(testItemName);
  await headerPage.clickCartButton();

  await expect(page).toHaveURL(expectedCartURL);
});

test('Can navigate to Items page from Cart page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const cartPage = new CartPage(page);
  const inventoryUrl = 'https://www.saucedemo.com/inventory.html';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickContinueShoppingButton();

  await expect(page).toHaveURL(inventoryUrl);
});

test('Can navigate to Item page from Cart page', async ({ page }) => {
  const testItemName = 'Sauce Labs Backpack';
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();
  await inventoryPage.addItemToCart(testItemName);
  await headerPage.clickCartButton();
  await inventoryPage.clickItemNameLink(testItemName);

  await expect(page).toHaveURL(/inventory-item\.html.*/);
});

test('Can navigate to Checkout step one page from Cart page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const cartPage = new CartPage(page);
  const checkoutUrl = 'https://www.saucedemo.com/checkout-step-one.html';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();

  await expect(page).toHaveURL(checkoutUrl);
});

test('Added Items details match when accessing Cart page', async ({ page }) => {
  const testItemNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  const inventoryItems = [];
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();
  for (const testItemName of testItemNames) {
    const item = await inventoryPage.addItemToCart(testItemName);
    inventoryItems.push(item);
  }
  await headerPage.clickCartButton();
  const allItemsOnCartPage = await inventoryPage.getAllItemsOnPage();

  expect(inventoryItems).toEqual(allItemsOnCartPage);
});

test('Item can be removed from Cart in Cart page', async ({ page }) => {
  const testItemNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  const inventoryItems = [];
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();
  for (const testItemName of testItemNames) {
    const item = await inventoryPage.addItemToCart(testItemName);
    inventoryItems.push(item);
  }
  await headerPage.clickCartButton();
  const itemToBeRemovedName = testItemNames[testItemNames.length - 1];
  await inventoryPage.removeItemFromCart(itemToBeRemovedName);
  const inventoryItemsFiltered = inventoryItems.filter(
    (item) => item.itemName !== itemToBeRemovedName,
  );
  const allItemsOnCartPage = await inventoryPage.getAllItemsOnPage();

  expect(inventoryItemsFiltered).toEqual(allItemsOnCartPage);
});
