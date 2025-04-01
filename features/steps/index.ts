import { Given, When, Then } from './fixtures';
import { Item, ShopPage } from '../../pages/shop';
import jacketsJson from '../../test-data/jacket.json';
import pantsJson from '../../test-data/pant.json';
import { ShippingPage } from '../../pages/shipping';
import { HomePage } from '../../pages/home';
import { MyAccountPage } from '../../pages/myaccount';
import { SignInPage } from '../../pages/signin';
import 'dotenv/config';

var orderId: string = '';

Given('Login as a registered user', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.goToSignInPage();
  
    const signInPage = new SignInPage(page);
    const email = process.env.EMAIL!;
    const password = process.env.PASSWORD!;
    if (!email || !password) {
      throw new Error('Please set the EMAIL and PASSWORD environment variables.');
    }
    else {
      await signInPage.signIn(email, password);
    }
});

When('Add items to cart', async ({ page }) => {
  const shopPage = new ShopPage(page);
  await shopPage.goToMenJacketsPage();
  const jackets: Item[] = JSON.parse(JSON.stringify(jacketsJson));
  const pants: Item[] = JSON.parse(JSON.stringify(pantsJson));
  await shopPage.chooseItems(jackets);
  await shopPage.goToMenPantsPage();
  await shopPage.chooseItems(pants);
  await shopPage.goToCart();
  await shopPage.proceedToCheckout();
});

Then('Verify order summary', async ({ page }) => {
  const shippingPage = new ShippingPage(page);
  const jackets: Item[] = JSON.parse(JSON.stringify(jacketsJson));
  const pants: Item[] = JSON.parse(JSON.stringify(pantsJson));
  jackets.push(...pants);
  shippingPage.verifyOrderSummary(jackets);
});

When('Place the order', async ({ page }) => {
  const shippingPage = new ShippingPage(page);
  await shippingPage.clickNextButton();
  const result = await shippingPage.clickPlaceOrderButton();
  if (result !== null) {
    orderId = result;
  } else {
    throw new Error('Order ID is null');
  }
});

Then('Verify order submission', async ({page}) => {
  const homePage = new HomePage(page);
  await homePage.goToMyAccountPage();
  const myAccountPage = new MyAccountPage(page);
  await myAccountPage.verifyOrderNumber(orderId);
});
