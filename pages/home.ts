import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly signInHeader: Locator;
  readonly menMenu: Locator;
  readonly topsMenu: Locator;
  readonly jacketsMenu: Locator;
  readonly actionSwitchButton: Locator
  readonly myAccountButton: Locator;
  readonly myAccountHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInButton = page.locator('a', { hasText: 'Sign In' });
    this.signInHeader = page.locator('span', { hasText: 'Customer Login' });
    this.menMenu = page.locator('span', { hasText: 'Men' });
    this.topsMenu = page.locator('span', { hasText: 'Tops' });
    this.jacketsMenu = page.locator('span', { hasText: 'Jackets' });
    this.actionSwitchButton = page.locator('button.action switch');
    this.myAccountButton = page.locator('a', { hasText: 'My Account' });
    this.myAccountHeader = page.locator('span', { hasText: 'My Account' });
  }

  async goto() {
    await this.page.goto('');
  }

  async goToSignInPage() {
    await this.signInButton.first().click();
    await expect(this.signInHeader).toBeVisible();
  }

  async goToMyAccountPage() {
    await this.actionSwitchButton.click();
    await this.myAccountButton.first().click();
    await expect(this.myAccountHeader).toBeVisible();
  }

}