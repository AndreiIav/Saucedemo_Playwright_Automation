import { type Page, type Locator } from '@playwright/test';
import { CartPageItemCard } from './CartPageItemCard'; 


export class CartPage {
  readonly page: Page;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly inventoryItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
    this.inventoryItem = page.getByTestId('inventory-item');
  }

  async clickContinueShoppingButton() {
    await this.continueShoppingButton.click();
  }

  async clickCheckoutButton() {
    await this.checkoutButton.click();
  }

  getItem (itemName: string): CartPageItemCard {
      const i = this.inventoryItem.filter({ hasText: itemName });
      const itemCard = new CartPageItemCard(i);
  
      return itemCard;
    }


}
