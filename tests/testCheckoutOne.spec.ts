import { expect } from '@playwright/test';
import pageURLs from './utils/pageURLs';
import { test } from './fixtures/fixtures';

test('Can navigate to Checkout step two page', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  page,
}) => {
  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.enterCheckoutInfo();
  await checkoutOnePage.clickContinueButton();

  await expect(page).toHaveURL(pageURLs.checkoutStepTwo);
});

test('Can navigate to Cart page by cancelling checkout', async ({
  inventoryPage,
  headerPage,
  cartPage,
  checkoutOnePage,
  page,
}) => {
  await inventoryPage.goto();
  await headerPage.clickCartButton();
  await cartPage.clickCheckoutButton();
  await checkoutOnePage.clickCancelButton();

  await expect(page).toHaveURL(pageURLs.cartPage);
});

test.describe('Test form errors', () => {
  [
    {
      fieldTest: 'First Name',
      firstName: '',
      lastName: 'lastName',
      zipPostalCode: 'zipPostalCode',
      expectedErrorMessage: 'Error: First Name is required',
    },
    {
      fieldTest: 'Last Name',
      firstName: 'firstName',
      lastName: '',
      zipPostalCode: 'zipPostalCode',
      expectedErrorMessage: 'Error: Last Name is required',
    },
    {
      fieldTest: 'Zip/Postal Code',
      firstName: 'firstName',
      lastName: 'lastName',
      zipPostalCode: '',
      expectedErrorMessage: 'Error: Postal Code is required',
    },
  ].forEach(({ fieldTest, firstName, lastName, zipPostalCode, expectedErrorMessage }) => {
    test(`Cannot continue to Checkout step two page if '${fieldTest}' field is not filled`, async ({
      inventoryPage,
      headerPage,
      cartPage,
      checkoutOnePage,
      page,
    }) => {
      await inventoryPage.goto();
      await headerPage.clickCartButton();
      await cartPage.clickCheckoutButton();
      await checkoutOnePage.enterCheckoutInfo(firstName, lastName, zipPostalCode);
      await checkoutOnePage.clickContinueButton();
      const errorText = await checkoutOnePage.getErrorText();

      expect(errorText).toBe(expectedErrorMessage);
      await expect(page).toHaveURL(pageURLs.checkoutStepOne);
    });
  });
});
