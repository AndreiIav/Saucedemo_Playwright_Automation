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
    readonly burgerMenu: Locator;
    readonly logOutButton: Locator;
    readonly sortContainer: Locator;
    readonly sortActiveOption: Locator;



    constructor(page: Page) {
        this.page = page;
        this.inventoryItem = page.getByTestId('inventory-item');
        this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
        this.burgerMenu = page.locator('#react-burger-menu-btn');
        this.logOutButton = page.locator('#logout_sidebar_link');
        this.sortActiveOption = page.getByTestId('active-option');
        this.sortContainer = page.getByTestId('product-sort-container');
    }

    async goto() {
        await this.page.goto('https://www.saucedemo.com/inventory.html');
    }

    async logOut() {
        await this.burgerMenu.click();
        await this.logOutButton.click();
    }

    async selectSortOption(option: string) {
        await this.sortContainer.click();
        await this.sortContainer.selectOption(option);
    }

    async getSortActiveOption() {
        return await this.sortActiveOption.innerText();
    }

    async getAllItemsOnPage(): Promise<Item[]> {
        const items = this.getInventoryItems();
        return await this.createItemCards(items);
    }

    async getOneItemByName(itemName: string) {
        const items = this.getInventoryItems(itemName);
        const item = await this.createItemCards(items);
        return item[0]
    }

    getInventoryItems(itemName = '') {
        return itemName
            ? this.inventoryItem.filter({ hasText: itemName })
            : this.inventoryItem;
    }

    async getNameOfAllItemsOnPage() {
        const items = this.getInventoryItems();
        const itemsCount = await items.count();
        const itemNames = [];

        for (let i = 0; i < itemsCount; i++) {
            const item = items.nth(i);
            const itemCard = new ItemCardPage(item);

            const itemName = await itemCard.getItemName();
            itemNames.push(itemName);
        }

        return itemNames;
    }

    async getPriceOfAllItemsOnPage() {
        const items = this.getInventoryItems();
        const itemsCount = await items.count();
        const itemPrices = [];

        for (let i = 0; i < itemsCount; i++) {
            const item = items.nth(i);
            const itemCard = new ItemCardPage(item);

            const itemPrice = await itemCard.getItemPrice();
            const itemPriceNumber = this.convertItemPriceToNumber(itemPrice);
            itemPrices.push(itemPriceNumber);
        }

        return itemPrices;
    }

    async addItemToCart(itemName: string): Promise<Item> {
        const item = await this.getOneItemByName(itemName);
        const addToCartButtonId =
            this.getItemAtribute(item, 'itemAddtoCartButton');
        await this.clickAddToCart(addToCartButtonId);
        return item;
    }

    async removeItemFromCart(itemName: string): Promise<Item> {
        const item = await this.getOneItemByName(itemName);
        const removeFromCartButtonId =
            this.getItemAtribute(item, 'itemRemoveButton');
        await this.clickAddToCart(removeFromCartButtonId);
        return item;
    }

    convertItemPriceToNumber(itemPrice: String) {
        return Number(itemPrice.replace(/[^.\d]/g, ''));
    }

    async clickAddToCart(addtoCartButtonId: string) {
        await this.page.getByTestId(addtoCartButtonId).click();
    }

    async clickRemoveFromCart(removeFromCartButtonId: string) {
        await this.page.getByTestId(removeFromCartButtonId).click();
    }

    getItemButton(item: Item, buttonType: "addToCart" | "Remove") {
        return buttonType === "addToCart"
            ? item.itemAddtoCartButton
            : item.itemRemoveButton
    }

    getItemAtribute(item: Item, key: keyof Item) {
        return item[key]
    }

    async getShoppingCartCount() {
        return this.shoppingCartBadge.innerText();
    }


    async createItemCards(items: Locator): Promise<Item[]> {
        const itemsCount = await items.count();
        const itemCards = [];

        for (let i = 0; i < itemsCount; i++) {
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
    createItemImageLocatorId(
        productName: string,
        prefix: string = "inventory-item-",
        suffix: string = '-img'
    ): string {
        return prefix + productName.toLocaleLowerCase().replace(/\s+/g, '-') + suffix;
    }

    /**
     * @param productName The product name to use
     * @param prefix      The prefix to be added to the edited product name:
     *                    "add-to-cart-", "remove-"
     * @returns           A string to be used as a data-test id
     */
    createProductCartLocatorId(
        productName: string,
        prefix: "add-to-cart-" | "remove-"
    ): string {
        return prefix + productName.toLocaleLowerCase().replace(/\s+/g, '-');
    }

}