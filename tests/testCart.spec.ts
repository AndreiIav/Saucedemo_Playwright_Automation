import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { HeaderPage } from './pages/HeaderPage';
import { CartPage } from './pages/CartPage';
import pageURLs from './utils/pageURLs';

test('Cart page can be accessed', async ({ page }) => {
  const testItemName = 'Sauce Labs Fleece Jacket';
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();
  await inventoryPage.addItemToCart(testItemName);
  await headerPage.clickCartButton();

  await expect(page).toHaveURL(pageURLs.cartPage);
});

test('Can navigate to Items page from Cart page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickContinueShoppingButton();

  await expect(page).toHaveURL(pageURLs.itemsPage);
});

test('Can navigate to Item page from Cart page', async ({ page }) => {
  const testItemName = 'Sauce Labs Backpack';
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const expectedUrlPattern = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

  await inventoryPage.goto();
  await inventoryPage.addItemToCart(testItemName);
  await headerPage.clickCartButton();
  await inventoryPage.clickItemNameLink(testItemName);

  await expect(page).toHaveURL(expectedUrlPattern);
});

test('Can navigate to Checkout step one page from Cart page', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();

  await expect(page).toHaveURL(pageURLs.checkoutStepOne);
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
