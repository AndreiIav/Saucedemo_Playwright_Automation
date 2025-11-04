import { type Page, type Locator } from '@playwright/test';
import { extractNumberFromString } from '../utils/price.utils';

export class CheckoutTwoPage {
  readonly page: Page;
  readonly itemTotal: Locator;
  readonly itemTax: Locator;
  readonly itemTotalPrice: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemTotal = page.getByTestId('subtotal-label');
    this.itemTax = page.getByTestId('tax-label');
    this.itemTotalPrice = page.getByTestId('total-label');
    this.cancelButton = page.getByTestId('cancel');
    this.finishButton = page.getByTestId('finish');
  }

  async clickCancelButton() {
    await this.cancelButton.click();
  }

  async clickFinishButton() {
    await this.finishButton.click();
  }

  async getItemTotal() {
    const text = await this.itemTotal.innerText();
    return extractNumberFromString(text);
  }

  async getItemTax() {
    const text = await this.itemTax.innerText();
    return extractNumberFromString(text);
  }

  async getItemTotalPrice() {
    const text = await this.itemTotalPrice.innerText();
    return extractNumberFromString(text);
  }
}
