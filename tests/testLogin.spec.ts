import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import logInErrorMessages from './test-data/logInErrorMessages';
import users from './test-data/users';

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('User Login Tests', () => {

    const URLs = {
        loginURL: 'https://www.saucedemo.com/',
        loggedInURL: 'https://www.saucedemo.com/inventory.html'
    }

    test('User can Login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login(users.standardUser.username, users.standardUser.password);

        await expect(page).toHaveURL(URLs.loggedInURL);
    });

    test('User cannot login with invalid username', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login(users.invalidUser.username, users.standardUser.password);
        const errorMessage = await loginPage.getLoginErrorMessage();

        await expect(page).toHaveURL(URLs.loginURL);
        expect(errorMessage).toContain(logInErrorMessages.wrongUserOrPassErrorMessage);
    });

    test('User cannot login with invalid password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login(users.standardUser.password, users.invalidUser.password);
        const errorMessage = await loginPage.getLoginErrorMessage();

        await expect(page).toHaveURL(URLs.loginURL);
        expect(errorMessage).toContain(logInErrorMessages.wrongUserOrPassErrorMessage);
    });

    test('User cannot login with missing username', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login('', users.invalidUser.password);
        const errorMessage = await loginPage.getLoginErrorMessage();

        await expect(page).toHaveURL(URLs.loginURL);
        expect(errorMessage).toContain(logInErrorMessages.missingUsernameErrorMessage);
    });

    test('User cannot login with missing password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();

        await loginPage.login(users.standardUser.password, '');
        const errorMessage = await loginPage.getLoginErrorMessage();

        await expect(page).toHaveURL(URLs.loginURL);
        expect(errorMessage).toContain(logInErrorMessages.missingPassErrorMessage);
    });

})

test.describe('Cannot access app pages without being logged in', () => {
    [
        {
            pageName: 'inventory.html',
            expectedError: logInErrorMessages.accessInventoryPageWithoutLoging
        },
        {
            pageName: 'inventory-item.html?id=4',
            expectedError: logInErrorMessages.accessInventoryPageItemWithoutLoging
        },
        {
            pageName: 'cart.html',
            expectedError: logInErrorMessages.accessCartPageWithoutLoging
        }
    ].forEach(({ pageName, expectedError }) => {
        test(`User cannot access '${pageName}' without being logged in`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.goto(pageName);

            const errorMessage = await loginPage.getLoginErrorMessage();

            expect(errorMessage).toContain(expectedError);
        });
    })

})