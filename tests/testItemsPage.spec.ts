import { expect } from '@playwright/test';
import pageURLs from './utils/pageURLs';
import { test } from './fixtures/fixtures';

test('Items can be added to cart', async ({ inventoryPage, headerPage }) => {
  const testItemNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
  ];

  await inventoryPage.goto();
  for (let i = 0; i < testItemNames.length; i++) {
    const item = inventoryPage.getItem(testItemNames[i]);
    await item.addToCart();
    const shoppingCartCount = await headerPage.getShoppingCartCount();

    expect(shoppingCartCount).toBe(i + 1);
    await expect(item.removeButton).toBeEnabled();
  }
});

test('Item can be removed from cart', async ({ inventoryPage, headerPage }) => {
  const testItemName = 'Test.allTheThings() T-Shirt (Red)';

  await inventoryPage.goto();
  // add item to cart
  const item = inventoryPage.getItem(testItemName);
  await item.addToCart()

  // check that the Remove button is enabled
  await expect(item.removeButton).toBeEnabled();
  // remove item from cart
  await item.remove();

  // check that the 'Add to cart' button is enabled for the removed item and
  // that the Cart counter is not visible
  await expect(item.addtoCartButton).toBeEnabled();
  await expect(headerPage.shoppingCartBadge).toBeHidden();
});

test('Items can be removed from cart', async ({
  inventoryPage,
  headerPage }) => {
  const testItemNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
  ];

  await inventoryPage.goto();
  // add items to cart
  for (let i = 0; i < testItemNames.length; i++) {
    const item = inventoryPage.getItem(testItemNames[i]);
    await item.addToCart();
  }

  let shoppingCartCount = await headerPage.getShoppingCartCount();
  expect(shoppingCartCount).toBe(testItemNames.length);

  // remove all items from cart except one and check the cart counter decreases
  // and that the 'Add to cart' button is enabled for the removed items
  for (let i = 0; i < testItemNames.length - 1; i++) {
    const item = inventoryPage.getItem(testItemNames[i]);
    await item.remove();
    const updatedShoppingCartCount = await headerPage.getShoppingCartCount();
    shoppingCartCount = shoppingCartCount - 1;

    expect(updatedShoppingCartCount).toBe(shoppingCartCount);
    await expect(item.addtoCartButton).toBeEnabled();
  }
});

test('Can navigate to Cart page', async ({
  inventoryPage,
  headerPage,
  page }) => {
  const testItemName = 'Sauce Labs Fleece Jacket';

  await inventoryPage.goto();
  const item = inventoryPage.getItem(testItemName);
  await item.addToCart();
  await headerPage.clickCartButton();

  await expect(page).toHaveURL(pageURLs.cartPage);
});

[
  {
    sortOption: 'za',
    expectedSortText: 'Name (Z to A)',
  },
  {
    sortOption: 'az',
    expectedSortText: 'Name (A to Z)',
  },
  {
    sortOption: 'lohi',
    expectedSortText: 'Price (low to high)',
  },
  {
    sortOption: 'hilo',
    expectedSortText: 'Price (high to low)',
  },
].forEach(({ sortOption, expectedSortText }) => {
  test(`Sort text '${expectedSortText}' updates when the option is selected`,
    async ({
      inventoryPage,
      headerPage,
    }) => {
    await inventoryPage.goto();
    await headerPage.selectSortOption(sortOption);
    const sortText = await headerPage.getSortActiveOption();

    expect(sortText).toBe(expectedSortText);
  });
});

test('Items are sorted A to Z', async ({ inventoryPage, headerPage }) => {
  const sortOption = 'az';

  await inventoryPage.goto();
  const itemNames = await inventoryPage.getNameOfAllItemsOnPage();
  await headerPage.selectSortOption(sortOption);
  const itemNamesSorted = await inventoryPage.getNameOfAllItemsOnPage();
  itemNames.sort();

  expect(itemNames).toEqual(itemNamesSorted);
});

test('Items are sorted Z to A', async ({ inventoryPage, headerPage }) => {
  const sortOption = 'za';

  await inventoryPage.goto();
  const itemNames = await inventoryPage.getNameOfAllItemsOnPage();
  await headerPage.selectSortOption(sortOption);
  const itemNamesSorted = await inventoryPage.getNameOfAllItemsOnPage();
  itemNames.sort().reverse();

  expect(itemNames).toEqual(itemNamesSorted);
});

test('Items are sorted by Price low to high', async ({
  inventoryPage,
  headerPage }) => {
  await inventoryPage.goto();
  const itemPrices = await inventoryPage.getPriceOfAllItemsOnPage();
  await headerPage.selectSortOption('lohi');
  const itemPricesSorted = await inventoryPage.getPriceOfAllItemsOnPage();
  itemPrices.sort((a, b) => a - b);

  expect(itemPrices).toEqual(itemPricesSorted);
});

test('Items are sorted by Price high to low', async ({
  inventoryPage,
  headerPage }) => {
  await inventoryPage.goto();
  const itemPrices = await inventoryPage.getPriceOfAllItemsOnPage();
  await headerPage.selectSortOption('hilo');
  const itemPricesSorted = await inventoryPage.getPriceOfAllItemsOnPage();
  itemPrices.sort((a, b) => b - a);

  expect(itemPrices).toEqual(itemPricesSorted);
});

test.describe('Item details page tests', () => {
  test('Item details page can be accessed for an Item', async ({
    inventoryPage,
    page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const expectedUrlPattern = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

    await inventoryPage.goto();
    const item = inventoryPage.getItem(testItemName);
    await item.openViaName();

    await expect(page).toHaveURL(expectedUrlPattern);
  });

  test('Item details match when accessing the Item details page',
    async ({ inventoryPage, itemDetailsPage, page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const urlItemPage = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

    await inventoryPage.goto();
    const item = inventoryPage.getItem(testItemName);
    const itemDetails = await item.getItemDetails();

    // access the item details page
    await item.openViaName();
    await page.waitForURL(urlItemPage);
    const itemPageDetails = await itemDetailsPage.getItemDetails();

    expect(itemDetails).toEqual(itemPageDetails);
  });

  test('Item can be added to cart from the Item details page', async ({
    inventoryPage,
    headerPage,
    itemDetailsPage,
    page
  }) => {
    const testItemName = 'Sauce Labs Backpack';
    const expectedShoppingCartCount = 1;
    const urlItemPage = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

    await inventoryPage.goto();
    const item = inventoryPage.getItem(testItemName);
    await item.openViaName();
    await page.waitForURL(urlItemPage);
    await itemDetailsPage.addToCart();

    await expect(itemDetailsPage.removeButton).toBeEnabled();
    await expect(headerPage.shoppingCartBadge).toBeEnabled();
    const shoppingCartCount = await headerPage.getShoppingCartCount();
    expect(shoppingCartCount).toBe(expectedShoppingCartCount);
  });

  test('Item can be removed from cart from the Item details page', async ({
    inventoryPage,
    headerPage,
    itemDetailsPage,
    page
  }) => {
    const testItemName = 'Sauce Labs Backpack';
    const expectedShoppingCartCount = 1;
    const urlItemPage = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

    await inventoryPage.goto();
    const item = inventoryPage.getItem(testItemName);
    await item.openViaName();
    await page.waitForURL(urlItemPage);

    // add item to cart
    await itemDetailsPage.addToCart();
    await expect(itemDetailsPage.removeButton).toBeEnabled()
    await expect(headerPage.shoppingCartBadge).toBeEnabled();
    const shoppingCartCount = await headerPage.getShoppingCartCount();
    expect(shoppingCartCount).toBe(expectedShoppingCartCount);

    // remove item from cart
    await itemDetailsPage.remove();

    await expect(itemDetailsPage.addtoCartButton).toBeEnabled();
    await expect(headerPage.shoppingCartBadge).toBeHidden();
  });

  test('Can navigate to Items page from Item details page', async ({ 
    inventoryPage,
    headerPage,
    page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const urlItemPage = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

    await inventoryPage.goto();
    const item = inventoryPage.getItem(testItemName);
    await item.openViaName()
    await page.waitForURL(urlItemPage);
    await headerPage.clickBackToProductsButton();

    await expect(page).toHaveURL(pageURLs.itemsPage);
  });
});
