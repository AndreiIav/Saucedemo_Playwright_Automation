import { expect } from '@playwright/test';
import pageURLs from './utils/pageURLs';
import { test } from './fixtures/fixtures';

test('Can navigate to Items page from Cart page', async ({
  inventoryPage,
  headerPage,
  cartPage,
  page,
}) => {
  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickContinueShoppingButton();

  await expect(page).toHaveURL(pageURLs.itemsPage);
});

test('Can navigate to Item page from Cart page', async ({ inventoryPage, headerPage, page }) => {
  const testItemName = 'Sauce Labs Backpack';
  const expectedUrlPattern = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

  await inventoryPage.goto();
  await inventoryPage.addItemToCart(testItemName);
  await headerPage.clickCartButton();
  await inventoryPage.clickItemNameLink(testItemName);

  await expect(page).toHaveURL(expectedUrlPattern);
});

test('Can navigate to Checkout step one page from Cart page', async ({
  inventoryPage,
  headerPage,
  cartPage,
  page,
}) => {
  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();

  await expect(page).toHaveURL(pageURLs.checkoutStepOne);
});

test('Added Items details match when accessing Cart page', async ({
  inventoryPage,
  headerPage,
}) => {
  const testItemNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  const inventoryItems = [];

  await inventoryPage.goto();
  for (const testItemName of testItemNames) {
    const item = await inventoryPage.addItemToCart(testItemName);
    inventoryItems.push(item);
  }
  await headerPage.clickCartButton();
  const allItemsOnCartPage = await inventoryPage.getAllItemsOnPage();

  expect(inventoryItems).toEqual(allItemsOnCartPage);
});

test('Item can be removed from Cart in Cart page', async ({ inventoryPage, headerPage }) => {
  const testItemNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  const inventoryItems = [];

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
