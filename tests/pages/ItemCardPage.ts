import { type Locator } from "@playwright/test";

export class ItemCardPage {
    readonly card: Locator;
    readonly inventoryItemName: Locator;
    readonly inventoryItemDescription: Locator;
    readonly inventoryItemPrice: Locator;

    constructor(card: Locator) {
        this.card = card;
        this.inventoryItemName = card.getByTestId('inventory-item-name');
        this.inventoryItemDescription = card.getByTestId('inventory-item-desc');
        this.inventoryItemPrice = card.getByTestId('inventory-item-price');
    }

    async getItemName() {
        return this.inventoryItemName.innerText();
    }

    async getItemDescription() {
        return this.inventoryItemDescription.innerText();
    }

    async getItemPrice() {
        return this.inventoryItemPrice.innerText();
    }

}