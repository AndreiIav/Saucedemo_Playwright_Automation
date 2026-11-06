import { type Page, type Locator } from "@playwright/test";

interface ItemDetails {
    name: string;
    price: string;
    description: string;
}

export class ItemDetailsPage {
    readonly page: Page;
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly addtoCartButton: Locator;
    readonly removeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.name = page.getByTestId('inventory-item-name');
        this.description = page.getByTestId('inventory-item-desc');
        this.price = page.getByTestId('inventory-item-price');
        this.addtoCartButton = page.getByTestId(/add-to-cart/);
        this.removeButton = page.getByTestId(/remove/);
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

    async getItemDetails (): Promise<ItemDetails> {
        const name = await this.getName();
        const price = await this.getPrice();
        const description = await this.getDescription();

        return { name, price, description }
    }

}