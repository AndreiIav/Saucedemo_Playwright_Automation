import { type Page, type Locator } from '@playwright/test';
import { ItemCardPage } from './ItemCardPage';

interface Item {
    itemName: string;
    itemDescription: string;
    itemPrice: string;
    itemImage: string;
    itemAddtoCartButton: string;
    itemRemoveButton: string;
}

export class InventoryPage {
    readonly page: Page;
    readonly inventoryItem: Locator;
    readonly shoppingCartBadge: Locator;


    constructor(page: Page) {
        this.page = page;
        this.inventoryItem = page.getByTestId('inventory-item');
        this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    }

    async goto() {
        await this.page.goto('https://www.saucedemo.com/inventory.html');
    }

    async getAllItemsOnPage(): Promise<Item[]> {
        const items = await this.getInventoryItems();
        return await this.createItemCards(items);
    }

    async getOneItemByName(itemName: string) {
        const items = await this.getInventoryItems(itemName);
        const item = await this.createItemCards(items);
        return item[0]
    }

    async getInventoryItems(itemName = '') {
        let items;
        if (itemName === '') {
            items = this.inventoryItem;
        } else {
            items = this.inventoryItem.filter({ hasText: itemName });
        }
        return items
    }

    async addItemToCart(item: Item) {
        const addToCartButtonId = await this.getItemAtribute(item, 'itemAddtoCartButton');
        await this.page.getByTestId(addToCartButtonId).click();
    }

    async removeItemFromCart(item: Item) {
        const removeFromCartButtonId = await this.getItemAtribute(item, 'itemRemoveButton');
        await this.page.getByTestId(removeFromCartButtonId).click();
    }

    async getItemButton(item: Item, buttonType: "addToCart" | "Remove") {
        if (buttonType === "addToCart") {
            return item.itemAddtoCartButton;
        } else {
            return item.itemRemoveButton;
        }
    }

    async getItemAtribute(item: Item, key: keyof Item) {
        return item[key]
    }

    async getShoppingCartCount() {
        return this.shoppingCartBadge.innerText();
    }


    async createItemCards(items: Locator): Promise<Item[]> {
        const itemsCount = await items.count();
        const itemCards = [];

        for (let i = 0; i < itemsCount; i++) {
            // const item = this.inventoryItem.nth(i);
            const item = items.nth(i);
            const itemCard = new ItemCardPage(item);

            const itemName = await itemCard.getItemName();
            const itemImageLocatorId = await this.createItemImageLocatorId(itemName);
            const itemAddToCartLocatorId = await this.createProductCartLocatorId(itemName, "add-to-cart-");
            const itemRemoveFromCartLocatorId = await this.createProductCartLocatorId(itemName, "remove-");

            // create Item object
            const new_item: Item = {
                itemName: itemName,
                itemDescription: await itemCard.getItemDescription(),
                itemPrice: await itemCard.getItemPrice(),
                itemImage: itemImageLocatorId,
                itemAddtoCartButton: itemAddToCartLocatorId,
                itemRemoveButton: itemRemoveFromCartLocatorId
            }

            itemCards.push(new_item);
        }
        return itemCards;
    }


    /**
     * @param productName The product name to use
     * @param prefix      The prefix to be added to the edited product name
     * @param suffix      The suffix to be added to the edited product name 
     * @returns           A string to be used as a data-test id
     */
    async createItemImageLocatorId(
        productName: string,
        prefix: string = "inventory-item-",
        suffix: string = '-img'
    ): Promise<string> {
        return prefix + productName.toLocaleLowerCase().replace(/\s+/g, '-') + suffix;
    }

    /**
     * @param productName The product name to use
     * @param prefix      The prefix to be added to the edited product name:
     *                    "add-to-cart-", "remove-"
     * @returns           A string to be used as a data-test id
     */
    async createProductCartLocatorId(
        productName: string,
        prefix: "add-to-cart-" | "remove-"
    ): Promise<string> {
        return prefix + productName.toLocaleLowerCase().replace(/\s+/g, '-');
    }

}