import { expect } from '@playwright/test';
import { calculateTax, calculateTotal } from './utils/price.utils';
import pageURLs from './utils/pageURLs';
import { test } from './fixtures/fixtures';

test('Added Items details match when accessing Checkout page', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
}) => {
  const testItemNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  const inventoryItems = [];

  await inventoryPage.goto();
  for (const testItemName of testItemNames) {
    const item = await inventoryPage.addItemToCart(testItemName);
    inventoryItems.push(item);
  }
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.enterCheckoutInfo();
  await checkoutOnePage.clickContinueButton();
  const checkoutItems = await inventoryPage.getAllItemsOnPage();

  expect(inventoryItems).toEqual(checkoutItems);
});

test('Cart Items Total is calculated correctly', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  checkoutTwoPage,
}) => {
  const testItemNames = ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt'];
  const inventoryItems = [];

  await inventoryPage.goto();
  for (const testItemName of testItemNames) {
    const item = await inventoryPage.addItemToCart(testItemName);
    inventoryItems.push(item);
  }
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.enterCheckoutInfo();
  await checkoutOnePage.clickContinueButton();
  const checkoutItems = await inventoryPage.getPriceOfAllItemsOnPage();

  const itemTotal = calculateTotal(...checkoutItems);
  const itemTax = calculateTax(itemTotal);
  const itemTotalPrice = calculateTotal(itemTotal, itemTax);
  const itemTotalDisplay = await checkoutTwoPage.getItemTotal();
  const itemTaxDisplay = await checkoutTwoPage.getItemTax();
  const itemTotalPriceDisplay = await checkoutTwoPage.getItemTotalPrice();

  expect(itemTotalDisplay).toBe(itemTotal);
  expect(itemTaxDisplay).toBe(itemTax);
  expect(itemTotalPriceDisplay).toBe(itemTotalPrice);
});

test('Order can be cancelled', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  checkoutTwoPage,
  page,
}) => {
  const testItemNames = 'Sauce Labs Backpack';

  await inventoryPage.goto();
  await inventoryPage.addItemToCart(testItemNames);
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.enterCheckoutInfo();
  await checkoutOnePage.clickContinueButton();
  await checkoutTwoPage.clickCancelButton();

  await expect(page).toHaveURL(pageURLs.itemsPage);
});

test('Order can be completed', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  checkoutTwoPage,
  page,
}) => {
  const testItemNames = 'Sauce Labs Backpack';

  await inventoryPage.goto();
  await inventoryPage.addItemToCart(testItemNames);
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.enterCheckoutInfo();
  await checkoutOnePage.clickContinueButton();
  await checkoutTwoPage.clickFinishButton();

  await expect(page).toHaveURL(pageURLs.checkoutComplete);
});
