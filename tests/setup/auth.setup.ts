import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from '../pages/LoginPage';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    const standardUser = process.env.STANDARD_USER;
    const password = process.env.PASSWORD;

    if (standardUser === undefined) {
        throw new Error('STANDARD_USER not defined in .env')
    } else if (password === undefined) {
        throw new Error('PASSWORD not defined in .env')
    }

    // Perform authentication steps.
    await page.goto('https://www.saucedemo.com/');
    const loginPage = new LoginPage(page);
    await loginPage.login(standardUser, password);
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await page.context().storageState({ path: authFile })
});