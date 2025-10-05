import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

// console.log(authFile)

setup('authenticate', async ({ page }) => {
    // Perform authentication steps.
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('https://www.saucedemo.com/inventory.html', { timeout: 30000 });
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await page.context().storageState({ path: authFile })
});