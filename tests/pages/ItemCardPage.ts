import { type Locator } from '@playwright/test';

interface ItemDetails {
    name: string;
    price: string;
    description: string;
}

export class ItemCard {
    readonly item: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly image: Locator;
    readonly addtoCartButton: Locator;
    readonly removeButton: Locator;
    readonly link: Locator;

    constructor(item: Locator) {
        this.item = item;
        this.name = item.getByTestId('inventory-item-name');
        this.description = item.getByTestId('inventory-item-desc');
        this.price = item.getByTestId('inventory-item-price');
        this.image = item.getByTestId(/img-link/);
        this.addtoCartButton = item.getByTestId(/add-to-cart/);
        this.removeButton = item.getByTestId(/remove/);
        this.link = item.getByTestId(/title-link/);
    }

    async getName () {
        return await this.name.innerText();
    }

    async getPrice() {
        return await this.price.innerText();
    }

    async getDescription() {
        return await this.description.innerText();
    }

    async addToCart() {
        await this.addtoCartButton.click();
    }

    async remove() {
        await this.removeButton.click();
    }

    async openViaName() {
        await this.link.click();
    } 

    async openViaImage () {
        await this.image.click()
    }

    async getItemDetails (): Promise<ItemDetails> {
        const name = await this.getName();
        const price = await this.getPrice();
        const description = await this.getDescription();

        return { name, price, description }
    }

}
