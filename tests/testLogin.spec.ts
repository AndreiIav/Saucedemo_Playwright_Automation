import { expect } from '@playwright/test';
import { test } from './fixtures/fixtures'
import { LoginPage } from './pages/LoginPage';
import logInErrorMessages from './test-data/logInErrorMessages';
import users from './test-data/users';
import pageURLs from './utils/pageURLs';

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('User Login Tests', () => {
  test('User can Login with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(users.standardUser.username, users.standardUser.password);

    await expect(page).toHaveURL(pageURLs.itemsPage);
  });

  test('User cannot login with invalid username', async ({ loginPage, page }) => {
    await loginPage.login(users.invalidUser.username, users.standardUser.password);
    const errorMessage = await loginPage.getLoginErrorMessage();

    await expect(page).toHaveURL('/');
    expect(errorMessage).toContain(logInErrorMessages.wrongUserOrPassErrorMessage);
  });

  test('User cannot login with invalid password', async ({ loginPage, page }) => {
    await loginPage.login(users.standardUser.password, users.invalidUser.password);
    const errorMessage = await loginPage.getLoginErrorMessage();

    await expect(page).toHaveURL('/');
    expect(errorMessage).toContain(logInErrorMessages.wrongUserOrPassErrorMessage);
  });

  test('User cannot login with missing username', async ({ loginPage, page }) => {
    await loginPage.login('', users.invalidUser.password);
    const errorMessage = await loginPage.getLoginErrorMessage();

    await expect(page).toHaveURL('/');
    expect(errorMessage).toContain(logInErrorMessages.missingUsernameErrorMessage);
  });

  test('User cannot login with missing password', async ({loginPage, page }) => {
    await loginPage.login(users.standardUser.password, '');
    const errorMessage = await loginPage.getLoginErrorMessage();

    await expect(page).toHaveURL('/');
    expect(errorMessage).toContain(logInErrorMessages.missingPassErrorMessage);
  });
});

test.describe('Cannot access app pages without being logged in', () => {
  [
    {
      pageName: pageURLs.itemsPage,
      expectedError: logInErrorMessages.accessInventoryPageWithoutLoging,
    },
    {
      pageName: pageURLs.itemPage,
      expectedError: logInErrorMessages.accessInventoryPageItemWithoutLoging,
    },
    {
      pageName: pageURLs.cartPage,
      expectedError: logInErrorMessages.accessCartPageWithoutLoging,
    },
  ].forEach(({ pageName, expectedError }) => {
    test(`User cannot access '${pageName}' without being logged in`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await page.goto(pageName);

      const errorMessage = await loginPage.getLoginErrorMessage();

      expect(errorMessage).toContain(expectedError);
    });
  });
});
