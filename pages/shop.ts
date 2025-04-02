import { expect, type Locator, type Page } from '@playwright/test';
import { it } from 'node:test';

export type Item = {
    name: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
}

export class ShopPage {
  readonly page: Page;
  readonly menMenu: Locator;
  readonly topsMenu: Locator;
  readonly jacketsMenu: Locator;
  readonly addToCartButton: Locator;
  readonly bottomsMenu: Locator;
  readonly pantsMenu: Locator;
  readonly cartIcon: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menMenu = page.locator('div[id="store.menu"] > nav > ul > li').locator(':text-is("Men")').locator('visible=true');
    this.topsMenu = page.locator('span', { hasText: 'Tops',  }).locator('visible=true');
    this.jacketsMenu = page.locator('span', { hasText: 'Jackets' }).locator('visible=true');
    this.bottomsMenu = page.locator('span', { hasText: 'Bottoms' }).locator('visible=true');
    this.pantsMenu = page.locator('span', { hasText: 'Pants' }).locator('visible=true');
    this.addToCartButton = page.locator('button', { hasText: 'Add to Cart' }).locator('visible=true');
    this.cartIcon = page.locator('a[class="action showcart"]').locator('visible=true');
    this.proceedToCheckoutButton = page.locator('button', { hasText: 'Proceed to Checkout' });
  }

  async goToMenJacketsPage() {
    await this.menMenu.hover({trial: true});
    await this.topsMenu.hover({trial: true});
    await this.jacketsMenu.click();
  }

  async chooseItems(items: Item[]) {
    for (const item of items) {
        for(var i=0; i < item["quantity"]; i++) {
            // await this.page.locator('div[class="product-item-info"]', { hasText: item["name"] }).click();
            const itemHolder = this.page.locator('div[class="product-item-info"]', { hasText: item["name"] });
            if (i === 0) {
                await itemHolder.locator('div[data-rendered=true]').locator('div[class="swatch-attribute size"]').locator('div[class="swatch-option text"]', {hasText: item["size"]}).click();
                await itemHolder.locator('div[data-rendered=true]').locator('div[class="swatch-attribute color"]').locator(`div[aria-label="${item["color"]}"]`).click();
            }
            await itemHolder.locator(this.addToCartButton).first().click();
            var confirmationAddedCart: Locator;
            confirmationAddedCart = this.page.locator('div[role="alert"]', { hasText: 'You added ' + item["name"] });
            await confirmationAddedCart.waitFor({ state: 'visible' });
        }
    }
  }

  async goToMenPantsPage() {
    var isElementVisible = await this.bottomsMenu.count();
    while (isElementVisible===0){
        await this.menMenu.hover({trial: true});
        isElementVisible = await this.bottomsMenu.count();
    }  
    await this.bottomsMenu.hover({trial: true});
    await this.pantsMenu.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }

}