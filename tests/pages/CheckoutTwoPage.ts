import { type Page, type Locator } from '@playwright/test';
import { extractNumberFromString } from '../utils/price.utils';
import { CheckoutStepTwoItemCard } from './checkoutStepTwoItemCardPage'; 

export class CheckoutTwoPage {
  readonly page: Page;
  readonly item: Locator;
  readonly itemTotal: Locator;
  readonly itemTax: Locator;
  readonly itemTotalPrice: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.item = page.getByTestId('inventory-item');
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

  getItem (itemName: string): CheckoutStepTwoItemCard {
        const i = this.item.filter({ hasText: itemName });
        const itemCard = new CheckoutStepTwoItemCard(i);
    
        return itemCard;
      }

  getItems (): Locator{
    return this.item;
  }

  async getPriceOfAllItemsOnPage(): Promise<number[]>{
      const items = this.getItems();
      const itemsCount = await items.count();
      const itemPrices = [];
  
      for (let i = 0; i < itemsCount; i++) {
        const item = new CheckoutStepTwoItemCard(items.nth(i));
  
        const itemPrice = await item.getPrice();
        const itemPriceNumber = extractNumberFromString(itemPrice);
        itemPrices.push(itemPriceNumber);
      }
  
      return itemPrices;
    }
    
}
