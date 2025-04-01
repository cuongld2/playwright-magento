import { expect, type Locator, type Page } from '@playwright/test';

export class SignInPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly homePageHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="login[username]"]');
    this.passwordInput = page.locator('input[name="login[password]"]');
    this.signInButton = page.locator('button', { hasText: 'Sign In' }).locator('visible=true');
    this.homePageHeader = page.locator('span', { hasText: 'Home Page' });
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await expect(this.homePageHeader).toBeVisible();
  }

}