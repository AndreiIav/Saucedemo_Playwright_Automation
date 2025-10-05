import { type Page, type Locator } from '@playwright/test'

export class LoginPage {
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly loginErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.getByTestId('username');
        this.passwordField = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-button');
        this.loginErrorMessage = page.getByTestId('error');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    async getLoginErrorMessage(loginErrorMessage: Locator = this.loginErrorMessage): Promise<string> {
        return await loginErrorMessage.textContent() ?? '';
    }
}