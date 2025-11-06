import { test, expect } from '@playwright/test';

// Reset storage state for this file to avoid being authenticated
test.use({ storageState: { cookies: [], origins: [] } });

test('Login page can be accessed', async ({ page }) => {
  const response = await page.request.get('/');

  await expect(response).toBeOK();
});
