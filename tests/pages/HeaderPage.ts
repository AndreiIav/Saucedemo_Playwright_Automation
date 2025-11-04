import { type Page, type Locator } from '@playwright/test';

export class HeaderPage {
  readonly page: Page;
  readonly shoppingCartButton: Locator;
  readonly shoppingCartBadge: Locator;
  // sort buttons locators
  readonly sortContainer: Locator;
  readonly sortActiveOption: Locator;
  // burger menu locators
  readonly burgerMenu: Locator;
  readonly logOutButton: Locator;
  //page title
  readonly pageTitle: Locator;
  // this button is present only in an Item page
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shoppingCartButton = page.getByTestId('shopping-cart-link');
    this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    this.sortActiveOption = page.getByTestId('active-option');
    this.sortContainer = page.getByTestId('product-sort-container');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logOutButton = page.locator('#logout_sidebar_link');
    this.pageTitle = page.getByTestId('title');
    this.backToProductsButton = page.getByTestId('back-to-products');
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

  async getShoppingCartCount() {
    return this.shoppingCartBadge.innerText();
  }

  async getPageTitle() {
    return this.pageTitle.innerText();
  }

  async clickBackToProductsButton() {
    await this.backToProductsButton.click();
  }

  async clickCartButton() {
    await this.shoppingCartButton.click();
  }
}
