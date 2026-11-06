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

test('Can navigate to Item details page from Cart page', async ({ 
    inventoryPage,
    headerPage,
    cartPage,
    page }) => {
  const testItemName = 'Sauce Labs Backpack';
  const expectedUrlPattern = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

  await inventoryPage.goto();
  const inventoryItem = inventoryPage.getItem('Sauce Labs Backpack');
  await inventoryItem.addToCart();
  await headerPage.clickCartButton();
  const cartItem = cartPage.getItem(testItemName);
  await cartItem.openViaName();

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

test('Added Inventory Items details match on Cart page', async ({
  inventoryPage,
  headerPage,
  cartPage
}) => {
  const testItemNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt'
  ];
  const inventoryItems = [];
  const cartItems = [];

  await inventoryPage.goto();
  for (const testItemName of testItemNames) {
    const inventoryItem = inventoryPage.getItem(testItemName);
    const inventoryItemDetails = await inventoryItem.getItemDetails();
    await inventoryItem.addToCart();
    inventoryItems.push(inventoryItemDetails);
  }
  
  await headerPage.clickCartButton();
  for (const testItemName of testItemNames) {
    const cartItem = cartPage.getItem(testItemName);
    const cartItemDetails = await cartItem.getItemDetails();
    cartItems.push(cartItemDetails);
  }

  expect(inventoryItems).toEqual(cartItems);
});

test('Item can be removed from Cart in Cart page', async ({ 
  inventoryPage,
  cartPage,
  headerPage }) => {
  const testItemName = 'Sauce Labs Backpack';

  await inventoryPage.goto();
  const inventoryItem = inventoryPage.getItem(testItemName);
  await inventoryItem.addToCart();

  await headerPage.clickCartButton();

  const cartItem = cartPage.getItem(testItemName);
  expect(cartItem.name).toBeVisible();

  await cartItem.remove();

  expect(cartItem.name).not.toBeVisible();
});
