import { type Page, type Locator } from '@playwright/test';

export class ItemPage {
  readonly page: Page;
  readonly itemAddtoCartButton: Locator;
  readonly itemRemoveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemAddtoCartButton = page.getByTestId('add-to-cart');
    this.itemRemoveButton = page.getByTestId('remove');
  }

  async clickAddtoCartButton() {
    await this.itemAddtoCartButton.click();
  }

  async clickRemoveFromCartButton() {
    await this.itemRemoveButton.click();
  }
}
