import { expect, type Locator, type Page } from '@playwright/test';
import { Item } from './shop';
import exp from 'constants';

export type ShippingAddress = {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
}

export class ShippingPage {
  readonly page: Page;
  readonly menMenu: Locator;
  readonly totalOrderedItems: Locator;
  readonly itemsList: Locator;
  readonly productItems: Locator;
  readonly nextButton: Locator;
  readonly placeOrderButton: Locator;
  readonly orderConfirmationHeader: Locator;
  readonly orderNumber: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menMenu = page.locator('span', { hasText: 'Men' });
    this.totalOrderedItems = page.locator('span["data-bind"="text: getCartSummaryItemsCount()"]');
    this.itemsList = page.locator('div.block items-in-cart');
    this.productItems = page.locator('div.product-item-inner');
    this.nextButton = page.locator('button[data-role="opc-continue"]');
    this.placeOrderButton = page.locator('button', { hasText: 'Place Order' });
    this.orderConfirmationHeader = page.locator('span', { hasText: 'Thank you for your purchase!' });
    this.orderNumber = page.locator('a.order-number');
  }

  async verifyOrderSummary(items: Item[]) {
    await this.menMenu.hover();
    var expectedTotalItems = items.length;
    expect(this.totalOrderedItems).toHaveText(expectedTotalItems.toString());
    this.expandItemsList();
    const allProductItems = await this.productItems.all();
    var matchedItems = 0;
    for (const item of items) {
      for (const productItem of allProductItems) {
        const productItemName = await productItem.locator('strong.product-item-name').textContent();
        if(productItemName === item["name"]) {
          const productItemPrice = (await productItem.locator('span.price').textContent())?.replace("$", "");
          const productItemQuantity = await productItem.locator('div.details-qty').textContent();
          expect(productItemPrice).toEqual((item["price"]*item["quantity"]).toString());
          expect(productItemQuantity).toEqual(item["quantity"].toString());
          matchedItems++;
        }
      }
    }
    expect(matchedItems).toEqual(expectedTotalItems);
  }

  async expandItemsList() {
    this.itemsList.locator('div.title').getAttribute('aria-expanded').then(async (value) => {
      if (value === 'false') {
        await this.itemsList.click();
      }
  })
}

    async enterShippingDetails(shippingAddress: ShippingAddress) {
        await this.page.locator('input[name="street[0]"]').fill(shippingAddress["street"]);
        await this.page.locator('input[name="city"]').fill(shippingAddress["city"]);
        await this.page.locator('input[name="postcode"]').fill(shippingAddress["postalCode"]);
        await this.page.selectOption('select[name="country_id"]', shippingAddress["country"]);
        await this.page.locator('input[name="telephone"]').fill(shippingAddress["phoneNumber"]);
    }

    async clickNextButton() {
        await this.nextButton.click();
    }
    
    async clickPlaceOrderButton() {
        await this.placeOrderButton.click();
        await expect(this.orderConfirmationHeader).toBeVisible();
        return await this.orderNumber.textContent();
    }

}