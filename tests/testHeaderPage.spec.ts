import { expect } from '@playwright/test';
import { test } from './fixtures/fixtures';

test('User can log out', async ({ inventoryPage, headerPage, page }) => {
  await inventoryPage.goto();
  await headerPage.logOut();

  await expect(page).toHaveURL('/');
});

test('Inventory Page name is "Products"', async ({ inventoryPage, headerPage }) => {
  const expectedPageName = 'Products';

  await inventoryPage.goto();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Cart Page name is "Your Cart"', async ({ inventoryPage, headerPage }) => {
  const expectedPageName = 'Your Cart';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Step One Page name is "Checkout: Your Information"', async ({
  inventoryPage,
  headerPage,
  cartPage,
}) => {
  const expectedPageName = 'Checkout: Your Information';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Step Two Page name is "Checkout: Overview"', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
}) => {
  const expectedPageName = 'Checkout: Overview';

  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.enterCheckoutInfo();
  await checkoutOnePage.clickContinueButton();
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Complete Page name is "Checkout: Complete!"', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  checkoutTwoPage,
}) => {
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
