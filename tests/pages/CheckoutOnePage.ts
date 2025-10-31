import { type Page, type Locator } from '@playwright/test';


export class CheckoutOnePage {
    readonly page: Page;
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly zipPostalCodeField: Locator;
    readonly cancelButton: Locator;
    readonly continueButton: Locator;
    readonly checkoutError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameField = page.getByTestId('firstName');
        this.lastNameField = page.getByTestId('lastName');
        this.zipPostalCodeField = page.getByTestId('postalCode');
        this.cancelButton = page.getByTestId('cancel');
        this.continueButton = page.getByTestId('continue');
        this.checkoutError = page.getByTestId('error');
    }

    async clickCancelButton() {
        await this.cancelButton.click();
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }

    async enterCheckoutInfo(
        firstName = 'first name',
        lastName = 'last name',
        zipPostalCode = 'postal code'
    ) {
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.zipPostalCodeField.fill(zipPostalCode);
    }

    async getErrorText() {
        return await this.checkoutError.textContent();
    }
}