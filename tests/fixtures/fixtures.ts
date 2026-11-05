import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { HeaderPage } from '../pages/HeaderPage';
import { ItemDetailsPage } from '../pages/ItemDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutOnePage } from '../pages/CheckoutOnePage';
import { CheckoutTwoPage } from '../pages/CheckoutTwoPage';

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  headerPage: HeaderPage;
  itemDetailsPage: ItemDetailsPage;
  cartPage: CartPage;
  checkoutOnePage: CheckoutOnePage;
  checkoutTwoPage: CheckoutTwoPage;
  username: string;
  password: string;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  headerPage: async ({ page }, use) => {
    const headerPage = new HeaderPage(page);
    await use(headerPage);
  },

  itemDetailsPage: async ({ page }, use) => {
    const itemDetailsPage = new ItemDetailsPage(page);
    await use(itemDetailsPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutOnePage: async ({ page }, use) => {
    const checkoutOnePage = new CheckoutOnePage(page);
    await use(checkoutOnePage);
  },

  checkoutTwoPage: async ({ page }, use) => {
    const checkoutTwoPage = new CheckoutTwoPage(page);
    await use(checkoutTwoPage);
  },

  username: async ({}, use) => {
    await use(process.env.USERNAME ?? 'standard_user');
  },

  password: async ({}, use) => {
    await use(process.env.PASSWORD ?? 'secret_sauce');
  },
});
