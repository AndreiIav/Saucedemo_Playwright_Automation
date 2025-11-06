import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { HeaderPage } from './pages/HeaderPage';
import { CartPage } from './pages/CartPage';
import { CheckoutOnePage } from './pages/CheckoutOnePage';
import { CheckoutTwoPage } from './pages/CheckoutTwoPage';

test('User can log out', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);

  await inventoryPage.goto();
  await headerPage.logOut();

  await expect(page).toHaveURL('/');
});

test('Inventory Page name is "Products"', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const expectedPageName = 'Products';

  await inventoryPage.goto();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Cart Page name is "Your Cart"', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const expectedPageName = 'Your Cart';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Step One Page name is "Checkout: Your Information"', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const cartPage = new CartPage(page);
  const expectedPageName = 'Checkout: Your Information';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Step Two Page name is "Checkout: Overview"', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const cartPage = new CartPage(page);
  const checkoutOnePage = new CheckoutOnePage(page);
  const expectedPageName = 'Checkout: Overview';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.enterCheckoutInfo();
  await checkoutOnePage.clickContinueButton();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Complete Page name is "Checkout: Complete!"', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const headerPage = new HeaderPage(page);
  const cartPage = new CartPage(page);
  const checkoutOnePage = new CheckoutOnePage(page);
  const checkoutTwoPage = new CheckoutTwoPage(page);
  const expectedPageName = 'Checkout: Complete!';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.enterCheckoutInfo();
  await checkoutOnePage.clickContinueButton();
  await checkoutTwoPage.clickFinishButton();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});
