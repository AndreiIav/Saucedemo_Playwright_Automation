import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutOnePage } from './pages/CheckoutOnePage';
import { HeaderPage } from './pages/HeaderPage'
import { CheckoutTwoPage } from './pages/CheckoutTwoPage';
import { calculateTax, calculateTotal } from './utils/price.utils';

test('Checkout step two page can be accessed', async ({ page }) => {
    const testItemNames = 'Sauce Labs Backpack';
    const expectedPageUrl = 'https://www.saucedemo.com/checkout-step-two.html';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);
    const cartPage = new CartPage(page);
    const checkoutOnePage = new CheckoutOnePage(page);

    await inventoryPage.goto();
    await inventoryPage.addItemToCart(testItemNames);
    await headerPage.clickCartButton();
    await cartPage.clickCheckoutButton();
    await checkoutOnePage.enterCheckoutInfo();
    await checkoutOnePage.clickContinueButton();

    expect(page).toHaveURL(expectedPageUrl);
});

test('Added Items details match when accessing Checkout page',
    async ({ page }) => {
        const testItemNames =
            ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt']
        const inventoryItems = [];
        const inventoryPage = new InventoryPage(page);
        const headerPage = new HeaderPage(page);
        const cartPage = new CartPage(page);
        const checkoutOnePage = new CheckoutOnePage(page);

        await inventoryPage.goto();
        for (const testItemName of testItemNames) {
            const item = await inventoryPage.addItemToCart(testItemName);
            inventoryItems.push(item);
        }
        await headerPage.clickCartButton();
        await cartPage.clickCheckoutButton();
        await checkoutOnePage.enterCheckoutInfo();
        await checkoutOnePage.clickContinueButton();
        const checkoutItems = await inventoryPage.getAllItemsOnPage();

        expect(inventoryItems).toEqual(checkoutItems);
    });

test('Calculate Items Total',
    async ({ page }) => {
        const testItemNames =
            ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Bolt T-Shirt']
        const inventoryItems = [];
        const inventoryPage = new InventoryPage(page);
        const headerPage = new HeaderPage(page);
        const cartPage = new CartPage(page);
        const checkoutOnePage = new CheckoutOnePage(page);
        const checkoutTwoPage = new CheckoutTwoPage(page);

        await inventoryPage.goto();
        for (const testItemName of testItemNames) {
            const item = await inventoryPage.addItemToCart(testItemName);
            inventoryItems.push(item);
        }
        await headerPage.clickCartButton();
        await cartPage.clickCheckoutButton();
        await checkoutOnePage.enterCheckoutInfo();
        await checkoutOnePage.clickContinueButton();
        const checkoutItems = await inventoryPage.getPriceOfAllItemsOnPage();

        const itemTotal = calculateTotal(...checkoutItems);
        const itemTax = calculateTax(itemTotal);
        const itemTotalPrice = calculateTotal(itemTotal, itemTax);
        const itemTotalDisplay = await checkoutTwoPage.getItemTotal();
        const itemTaxDisplay = await checkoutTwoPage.getItemTax();
        const itemTotalPriceDisplay = await checkoutTwoPage.getItemTotalPrice();

        expect(itemTotalDisplay).toBe(itemTotal);
        expect(itemTaxDisplay).toBe(itemTax);
        expect(itemTotalPriceDisplay).toBe(itemTotalPrice);
    });

test('Can cancel order', async ({ page }) => {
    const testItemNames = 'Sauce Labs Backpack';
    const expectedPageUrl = 'https://www.saucedemo.com/inventory.html';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);
    const cartPage = new CartPage(page);
    const checkoutOnePage = new CheckoutOnePage(page);
    const checkoutTwoPage = new CheckoutTwoPage(page);

    await inventoryPage.goto();
    await inventoryPage.addItemToCart(testItemNames);
    await headerPage.clickCartButton();
    await cartPage.clickCheckoutButton();
    await checkoutOnePage.enterCheckoutInfo();
    await checkoutOnePage.clickContinueButton();
    await checkoutTwoPage.clickCancelButton();

    expect(page).toHaveURL(expectedPageUrl);
});

test('Order can be completed', async ({ page }) => {
    const testItemNames = 'Sauce Labs Backpack';
    const expectedPageUrl = 'https://www.saucedemo.com/checkout-complete.html';
    const inventoryPage = new InventoryPage(page);
    const headerPage = new HeaderPage(page);
    const cartPage = new CartPage(page);
    const checkoutOnePage = new CheckoutOnePage(page);
    const checkoutTwoPage = new CheckoutTwoPage(page);

    await inventoryPage.goto();
    await inventoryPage.addItemToCart(testItemNames);
    await headerPage.clickCartButton();
    await cartPage.clickCheckoutButton();
    await checkoutOnePage.enterCheckoutInfo();
    await checkoutOnePage.clickContinueButton();
    await checkoutTwoPage.clickFinishButton();

    expect(page).toHaveURL(expectedPageUrl);
});