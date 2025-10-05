import { test, expect } from '@playwright/test';

test('Login page can be accessed', async ({ page }) => {
    const response = await page.request.get('https://www.saucedemo.com/');

    await expect(response).toBeOK();
}
)
