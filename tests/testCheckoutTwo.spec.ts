import { expect } from '@playwright/test';
import { calculateTax, calculateTotal } from './utils/price.utils';
import pageURLs from './utils/pageURLs';
import { test } from './fixtures/fixtures';

test('Added Items details match when accessing Checkout page', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  checkoutTwoPage,
  page
}) => {
  const testItemNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt'];
  const inventoryItems = [];
  const checkoutItems = [];

  await inventoryPage.goto();
  for (const testItemName of testItemNames) {
    const inventoryItem = inventoryPage.getItem(testItemName);
    await inventoryItem.addToCart();
    const inventoryItemDetails = await inventoryItem.getItemDetails();
    inventoryItems.push(inventoryItemDetails);
  }

  await headerPage.clickCartButton();
  await page.waitForURL(pageURLs.cartPage);
  await cartPage.clickCheckoutButton();

  await page.waitForURL(pageURLs.checkoutStepOne);
  await checkoutOnePage.enterValuesForCheckoutField();
  await checkoutOnePage.clickContinueButton();

  await page.waitForURL(pageURLs.checkoutStepTwo);
  for (const testItemName of testItemNames) {
    const checkoutItem = checkoutTwoPage.getItem(testItemName);
    const checkoutItemDetails = await checkoutItem.getItemDetails();
    checkoutItems.push(checkoutItemDetails);
  }

  expect(inventoryItems).toEqual(checkoutItems);
});

test('Cart Items Total is calculated correctly', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  checkoutTwoPage,
  page
}) => {
  const testItemNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt'];
  const inventoryItems = [];

  await inventoryPage.goto();
  for (const testItemName of testItemNames) {
    const inventoryItem = inventoryPage.getItem(testItemName);
    await inventoryItem.addToCart();
    const inventoryItemDetails = await inventoryItem.getItemDetails();
    inventoryItems.push(inventoryItemDetails);
  }
  await headerPage.clickCartButton();

  await page.waitForURL(pageURLs.cartPage);
  await cartPage.clickCheckoutButton();

  await page.waitForURL(pageURLs.checkoutStepOne);
  await checkoutOnePage.enterValuesForCheckoutField();
  await checkoutOnePage.clickContinueButton();

  await expect(page).toHaveURL(pageURLs.checkoutStepTwo);
  const checkoutItems = await checkoutTwoPage.getPriceOfAllItemsOnPage();

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
  const testItemName = 'Sauce Labs Backpack';

  await inventoryPage.goto();
  const item = inventoryPage.getItem(testItemName);
  await item.addToCart();
  await headerPage.clickCartButton();

  await page.waitForURL(pageURLs.cartPage);
  await cartPage.clickCheckoutButton();

  await page.waitForURL(pageURLs.checkoutStepOne);
  await checkoutOnePage.enterValuesForCheckoutField();
  await checkoutOnePage.clickContinueButton();

  await page.waitForURL(pageURLs.checkoutStepTwo);
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
  const testItemName = 'Sauce Labs Backpack';

  await inventoryPage.goto();
  const item = inventoryPage.getItem(testItemName);
  await item.addToCart();
  await headerPage.clickCartButton();

  await page.waitForURL(pageURLs.cartPage);
  await cartPage.clickCheckoutButton();

  await page.waitForURL(pageURLs.checkoutStepOne);
  await checkoutOnePage.enterValuesForCheckoutField();
  await checkoutOnePage.clickContinueButton();

  await page.waitForURL(pageURLs.checkoutStepTwo);
  await checkoutTwoPage.clickFinishButton();

  await expect(page).toHaveURL(pageURLs.checkoutComplete);
});
