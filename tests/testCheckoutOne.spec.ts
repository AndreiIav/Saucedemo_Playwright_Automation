import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { HeaderPage } from './pages/HeaderPage';
import { CartPage } from './pages/CartPage';
import { CheckoutOnePage } from './pages/CheckoutOnePage';

test('Checkout step one page can be accessed', async ({ page }) => {
    const testItemNames = 'Sauce Labs Backpack';
    const expectedPageUrl = 'https://www.saucedemo.com/checkout-step-one.html';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.goto();
    await inventoryPage.addItemToCart(testItemNames);
    await headerPage.clickCartButton();
    await cartPage.clickCheckoutButton();

    expect(page).toHaveURL(expectedPageUrl);
});

test('Next page can be accessed after all required information has been filled',
    async ({ page }) => {
        const checkoutOverviewUrl = 'https://www.saucedemo.com/checkout-step-two.html'
        const inventoryPage = new InventoryPage(page);
        const headerPage = new HeaderPage(page);
        const cartPage = new CartPage(page);
        const checkoutOnePage = new CheckoutOnePage(page);

        await inventoryPage.goto();
        await headerPage.clickCartButton();
        await cartPage.clickCheckoutButton();
        await checkoutOnePage.enterCheckoutInfo();
        await checkoutOnePage.clickContinueButton();

        expect(page).toHaveURL(checkoutOverviewUrl);
    });

test('Can go back to Cart page', async ({ page }) => {
    const cartUrl = 'https://www.saucedemo.com/cart.html';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);
    const cartPage = new CartPage(page);
    const checkoutOnePage = new CheckoutOnePage(page);

    await inventoryPage.goto();
    await headerPage.clickCartButton();
    await cartPage.clickCheckoutButton();
    await checkoutOnePage.clickCancelButton();

    expect(page).toHaveURL(cartUrl);
});

test.describe('Test form errors', () => {

    [
        {
            fieldTest: 'First Name',
            firstName: '',
            lastName: 'lastName',
            zipPostalCode: 'zipPostalCode',
            expectedErrorMessage: 'Error: First Name is required'
        },
        {
            fieldTest: 'Last Name',
            firstName: 'firstName',
            lastName: '',
            zipPostalCode: 'zipPostalCode',
            expectedErrorMessage: 'Error: Last Name is required'
        },
        {
            fieldTest: 'Zip/Postal Code',
            firstName: 'firstName',
            lastName: 'lastName',
            zipPostalCode: '',
            expectedErrorMessage: 'Error: Postal Code is required'
        },

    ].forEach(({ fieldTest, firstName, lastName, zipPostalCode, expectedErrorMessage }) => {
        test(`Cannot continue if '${fieldTest}' field is not filled`, async ({ page }) => {
            const inventoryPage = new InventoryPage(page);
            const headerPage = new HeaderPage(page);
            const cartPage = new CartPage(page);
            const checkoutOnePage = new CheckoutOnePage(page);

            await inventoryPage.goto();
            await headerPage.clickCartButton();
            await cartPage.clickCheckoutButton();
            await checkoutOnePage.enterCheckoutInfo(
                firstName, lastName, zipPostalCode);
            await checkoutOnePage.clickContinueButton();
            const errorText = await checkoutOnePage.getErrorText();

            expect(errorText).toBe(expectedErrorMessage);
        });

    });

});