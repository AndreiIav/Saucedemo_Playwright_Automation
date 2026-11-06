import { type Page, type Locator } from '@playwright/test';
import { ItemCard } from './ItemCardPage';
import { extractNumberFromString } from '../utils/price.utils';
import pageURLs from '../utils/pageURLs';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItem = page.getByTestId('inventory-item');
  }
  
  async goto() {
    await this.page.goto(pageURLs.itemsPage);
  }
  
  getItems (): Locator{
    return this.inventoryItem;
  }

  getItem (itemName: string): ItemCard {
    const i = this.inventoryItem.filter({ hasText: itemName });
    const itemCard = new ItemCard(i);

    return itemCard;
  }

  async getPriceOfAllItemsOnPage(): Promise<number[]> {
    const items = this.getItems();
    const itemsCount = await items.count();
    const itemPrices = [];

    for (let i = 0; i < itemsCount; i++) {
      const item = new ItemCard(items.nth(i));

      const itemPrice = await item.getPrice();
      const itemPriceNumber = extractNumberFromString(itemPrice);
      itemPrices.push(itemPriceNumber);
    }

    return itemPrices;
  }

  async getNameOfAllItemsOnPage(): Promise<string[]> {
      const items = this.getItems();
      const itemsCount = await items.count();
      const itemNames = [];
  
      for (let i = 0; i < itemsCount; i++) {
        const item = new ItemCard(items.nth(i));
  
        const itemName = await item.getName();
        itemNames.push(itemName);
      }
  
      return itemNames;
    }
}


