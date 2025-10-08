import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';
import users from '../test-data/users';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    // Perform authentication steps.
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await page.context().storageState({ path: authFile })
});