import { expect } from '@playwright/test';
import pageURLs from './utils/pageURLs';
import { test } from './fixtures/fixtures';
import { checkoutOneFormErrorMessages } from './test-data/checkoutOneFormErrorMessages';

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

  await checkoutOnePage.enterValuesForCheckoutField();
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

test.describe('Test Checkout step one form errors', () => {
  [
    {
      fieldTest: 'First Name',
      firstName: '',
      lastName: 'lastName',
      zipPostalCode: 'zipPostalCode',
      expectedErrorMessage: checkoutOneFormErrorMessages.missingFirstName,
    },
    {
      fieldTest: 'Last Name',
      firstName: 'firstName',
      lastName: '',
      zipPostalCode: 'zipPostalCode',
      expectedErrorMessage: checkoutOneFormErrorMessages.missingLastName,
    },
    {
      fieldTest: 'Zip/Postal Code',
      firstName: 'firstName',
      lastName: 'lastName',
      zipPostalCode: '',
      expectedErrorMessage: checkoutOneFormErrorMessages.missingZipPostalCode,
    },
  ].forEach(({ fieldTest, firstName, lastName, zipPostalCode, expectedErrorMessage }) => {
    test(`Correct error message is displayed when '${fieldTest}' field is not populated`, async ({
      inventoryPage,
      headerPage,
      cartPage,
      checkoutOnePage
    }) => {
      await inventoryPage.goto();
      await headerPage.clickCartButton();
      await cartPage.clickCheckoutButton();

      await checkoutOnePage.enterValuesForCheckoutField(firstName, lastName, zipPostalCode);
      await checkoutOnePage.clickContinueButton();
      const errorText = await checkoutOnePage.getErrorText();

      expect(errorText).toBe(expectedErrorMessage);
    });
  });
});