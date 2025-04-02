import { expect, type Locator, type Page } from '@playwright/test';

export class MyAccountPage {
  readonly page: Page;
  readonly orderNumber: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderNumber = page.locator('td[data-th="Order #"]');
  }

  async verifyOrderNumber(orderNumber: string) {
    const orderNumberText = await this.orderNumber.first().textContent();
    expect(orderNumberText).toEqual(orderNumber);
  }

}