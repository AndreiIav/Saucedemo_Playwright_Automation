import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('User Login Tests', () => {

    const URLs = {
        loginURL: 'https://www.saucedemo.com/',
        loggedInURL: 'https://www.saucedemo.com/inventory.html'
    }

    const testData = {
        validUsername: 'standard_user',
        validPassword: 'secret_sauce',
        invalidUsername: 'invalid_user',
        invalidPassword: 'invalid_password'
    }

    const selectors = {
        burgerMenu: '#react-burger-menu-btn',
        logOutButton: '#logout_sidebar_link'
    }

    const errorMessages = {
        wrongUserOrPassErrorMessage: 'Username and password do not match any'
            + ' user in this service',
        missingUsernameErrorMessage: 'Username is required',
        missingPassErrorMessage: 'Password is required',
        accessInventoryPageWithoutLoging: "You can only access '/inventory.html'"
            + " when you are logged in."
    }

    test.beforeEach(async ({ page }) => {
        await page.goto(URLs.loginURL);
    });

    test('User can Login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login(testData.validUsername, testData.validPassword);

        await expect(page).toHaveURL(URLs.loggedInURL);
    });

    test('User can logout', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login(testData.validUsername, testData.validPassword);
        await expect(page).toHaveURL(URLs.loggedInURL);
        await page.click(selectors.burgerMenu);
        await page.click(selectors.logOutButton);

        await expect(page).toHaveURL(URLs.loginURL);
    })

    test('User cannot login with invalid username', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login(testData.invalidUsername, testData.validPassword);
        const errorMessage = await loginPage.getLoginErrorMessage();

        await expect(page).toHaveURL(URLs.loginURL);
        expect(errorMessage).toContain(errorMessages.wrongUserOrPassErrorMessage);
    });

    test('User cannot login with invalid password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login(testData.validUsername, testData.invalidPassword);
        const errorMessage = await loginPage.getLoginErrorMessage();

        await expect(page).toHaveURL(URLs.loginURL);
        expect(errorMessage).toContain(errorMessages.wrongUserOrPassErrorMessage);
    });

    test('User cannot login with missing username', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login('', testData.invalidPassword);
        const errorMessage = await loginPage.getLoginErrorMessage();

        await expect(page).toHaveURL(URLs.loginURL);
        expect(errorMessage).toContain(errorMessages.missingUsernameErrorMessage);
    });

    test('User cannot login with missing password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.login(testData.validUsername, '');
        const errorMessage = await loginPage.getLoginErrorMessage();

        await expect(page).toHaveURL(URLs.loginURL);
        expect(errorMessage).toContain(errorMessages.missingPassErrorMessage);
    });

})

test.describe('Cannot access app pages without being logged in', () => {
    const basePage = 'https://www.saucedemo.com';
    const selectors = {
        errorMessage: '.error-message-container > h3'
    };

    [
        {
            pageName: '/inventory.html', expectedError: "You can only access"
                + " '/inventory.html' when you are logged in."
        },
        {
            pageName: '/inventory-item.html?id=4', expectedError: "You can only"
                + " access '/inventory-item.html' when you are logged in."
        },
        {
            pageName: '/cart.html', expectedError: "You can only access"
                + " '/cart.html' when you are logged in."
        }
    ].forEach(({ pageName, expectedError }) => {
        test(`User cannot access '${pageName}' without being logged in`, async ({ page }) => {
            await page.goto(basePage + pageName);
            const errorMessage = await page.locator(selectors.errorMessage).textContent();

            await expect(page).toHaveURL(basePage);
            expect(errorMessage).toContain(expectedError);
        });
    })

})