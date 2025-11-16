import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { HeaderPage } from '../pages/HeaderPage';
import { ItemPage } from '../pages/ItemPage';

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  headerPage: HeaderPage;
  itemPage: ItemPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await use(inventoryPage);
  },

  headerPage: async ({ page }, use) => {
    const headerPage = new HeaderPage(page);
    await use(headerPage);
  },

  itemPage: async ({ page }, use) => {
    const itemPage = new ItemPage(page);
    await use(itemPage);
  },
});
