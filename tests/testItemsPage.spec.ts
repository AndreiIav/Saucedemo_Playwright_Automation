import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { HeaderPage } from './pages/HeaderPage';
import { ItemPage } from './pages/ItemPage';
import pageURLs from './utils/pageURLs';

test('Items can be added to cart', async ({ page }) => {
  const testItemNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
  ];
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();

  for (let i = 0; i < testItemNames.length; i++) {
    const item = await inventoryPage.addItemToCart(testItemNames[i]);
    const shoppingCartCount = await headerPage.getShoppingCartCount();

    expect(shoppingCartCount).toBe(i + 1);
    await expect(page.getByTestId(inventoryPage.getItemButton(item, 'Remove'))).toBeEnabled();
  }
});

test('Item can be removed from cart', async ({ page }) => {
  const testItemName = 'Test.allTheThings() T-Shirt (Red)';
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();
  // add item to cart
  const item = await inventoryPage.addItemToCart(testItemName);
  const itemAddButton = inventoryPage.getItemButton(item, 'addToCart');
  // remove item from cart
  await inventoryPage.removeItemFromCart(testItemName);

  // check that the 'Add to cart' button is enabled for the removed item and
  // that the Cart counter is not visible
  await expect(page.getByTestId(itemAddButton)).toBeEnabled();
  await expect(headerPage.shoppingCartBadge).toBeHidden();
});

test('Items can be removed from cart', async ({ page }) => {
  const testItemNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
  ];
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();
  // add items to cart
  for (let i = 0; i < testItemNames.length; i++) {
    await inventoryPage.addItemToCart(testItemNames[i]);
  }

  let shoppingCartCount = await headerPage.getShoppingCartCount();
  expect(shoppingCartCount).toBe(testItemNames.length);

  // remove all items from cart except one and check the cart counter decreases
  // and that the 'Add to cart' button is enabled for the removed items
  for (let i = 0; i < testItemNames.length - 1; i++) {
    const item = await inventoryPage.removeItemFromCart(testItemNames[i]);
    const itemAddButton = inventoryPage.getItemButton(item, 'addToCart');
    const updatedShoppingCartCount = await headerPage.getShoppingCartCount();
    shoppingCartCount = shoppingCartCount - 1;

    expect(updatedShoppingCartCount).toBe(shoppingCartCount);
    await expect(page.getByTestId(itemAddButton)).toBeEnabled();
  }
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
  test(`Sort text '${expectedSortText}' updates when the option is selected`, async ({ page }) => {
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
    const expectedUrlPattern = new RegExp(`${pageURLs.itemPage}\\?id=\\d+$`);

    await inventoryPage.goto();
    await inventoryPage.clickItemNameLink(testItemName);

    await expect(page).toHaveURL(expectedUrlPattern);
  });

  test('Item details match when accessing the Item page', async ({ page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.goto();
    const testItemCard = await inventoryPage.getOneItemByName(testItemName);
    await inventoryPage.clickItemNameLink(testItemName);
    const testClickedItemCard = await inventoryPage.getOneItemByName(testItemName);

    expect(testItemCard).toEqual(testClickedItemCard);
  });

  test('Item can be added to cart from the Item page', async ({ page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);
    const itemPage = new ItemPage(page);
    const expectedShoppingCartCount = 1;

    await inventoryPage.goto();
    await inventoryPage.clickItemNameLink(testItemName);
    await itemPage.clickAddtoCartButton();
    const shoppingCartCount = await headerPage.getShoppingCartCount();

    await expect(itemPage.itemRemoveButton).toBeEnabled();
    expect(shoppingCartCount).toBe(expectedShoppingCartCount);
  });

  test('Item can be removed from cart from the Item page', async ({ page }) => {
    const testItemName = 'Sauce Labs Backpack';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);
    const itemPage = new ItemPage(page);
    const expectedShoppingCartCount = 1;

    await inventoryPage.goto();
    await inventoryPage.clickItemNameLink(testItemName);
    await itemPage.clickAddtoCartButton();
    await expect(itemPage.itemRemoveButton).toBeEnabled();
    const shoppingCartCount = await headerPage.getShoppingCartCount();
    expect(shoppingCartCount).toBe(expectedShoppingCartCount);
    await itemPage.clickRemoveFromCartButton();

    await expect(itemPage.itemAddtoCartButton).toBeEnabled();
    await expect(headerPage.shoppingCartBadge).toBeHidden();
  });

  test('Can navigate to Items page from Item page', async ({ page }) => {
    const testItemName = 'Sauce Labs Onesie';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);

    await inventoryPage.goto();
    await inventoryPage.clickItemNameLink(testItemName);
    await headerPage.clickBackToProductsButton();

    await expect(page).toHaveURL(pageURLs.itemsPage);
  });
});
