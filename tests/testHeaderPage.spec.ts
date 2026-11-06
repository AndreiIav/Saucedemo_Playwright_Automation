import { expect } from '@playwright/test';
import { test } from './fixtures/fixtures';
import pageURLs from './utils/pageURLs';

test('User can log out', async ({ inventoryPage, headerPage, page }) => {
  await inventoryPage.goto();
  await headerPage.logOut();

  await expect(page).toHaveURL('/');
});

test('Inventory Page name is "Products"', async ({ inventoryPage, headerPage, page }) => {
  const expectedPageName = 'Products';

  await inventoryPage.goto();
  await page.waitForURL(pageURLs.itemsPage);
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);

  
});

test('Cart Page name is "Your Cart"', async ({ inventoryPage, headerPage, page }) => {
  const expectedPageName = 'Your Cart';

  await inventoryPage.goto();
  await headerPage.clickCartButton();

  await page.waitForURL(pageURLs.cartPage);
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Step One Page name is "Checkout: Your Information"', async ({
  inventoryPage,
  headerPage,
  cartPage,
  page
}) => {
  const expectedPageName = 'Checkout: Your Information';

  await inventoryPage.goto();
  await page.waitForURL(pageURLs.itemsPage);
  await headerPage.clickCartButton();

  await page.waitForURL(pageURLs.cartPage);
  await cartPage.clickCheckoutButton();

  await page.waitForURL(pageURLs.checkoutStepOne);
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Step Two Page name is "Checkout: Overview"', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  page
}) => {
  const expectedPageName = 'Checkout: Overview';

  await inventoryPage.goto();
  await page.waitForURL(pageURLs.itemsPage);
  await headerPage.clickCartButton();

  await page.waitForURL(pageURLs.cartPage);
  await cartPage.clickCheckoutButton();

  await page.waitForURL(pageURLs.checkoutStepOne);
  await checkoutOnePage.enterValuesForCheckoutField();
  await checkoutOnePage.clickContinueButton();

  await page.waitForURL(pageURLs.checkoutStepTwo);
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});

test('Checkout Complete Page name is "Checkout: Complete!"', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  checkoutTwoPage,
  page
}) => {
  const expectedPageName = 'Checkout: Complete!';

  await inventoryPage.goto();
  await page.waitForURL(pageURLs.itemsPage);
  await headerPage.clickCartButton();

  await page.waitForURL(pageURLs.cartPage);
  await cartPage.clickCheckoutButton();

  await page.waitForURL(pageURLs.checkoutStepOne);
  await checkoutOnePage.enterValuesForCheckoutField();
  await checkoutOnePage.clickContinueButton();

  await page.waitForURL(pageURLs.checkoutStepTwo);
  await checkoutTwoPage.clickFinishButton();
  
  await page.waitForURL(pageURLs.checkoutComplete);
  const pageTitle = await headerPage.getPageTitle();

  expect(pageTitle).toBe(expectedPageName);
});
