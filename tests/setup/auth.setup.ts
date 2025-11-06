import { test as setup, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import users from '../test-data/users';
import pageURLs from '../utils/pageURLs';

const rootDirectory = fileURLToPath(import.meta.url);
const rootDirectoryPath = path.dirname(rootDirectory);
const authFile = path.join(rootDirectoryPath, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps.
  const loginPage = new LoginPage(page);
  await page.goto('/');
  await loginPage.login(users.standardUser.username, users.standardUser.password);
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(pageURLs.itemsPage);
  await expect(page).toHaveURL(pageURLs.itemsPage);

  await page.context().storageState({ path: authFile });
});
