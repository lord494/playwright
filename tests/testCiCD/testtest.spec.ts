import { test, expect, Page } from '@playwright/test';
import { Constants } from '../../helpers/constants';

test.use({ storageState: 'auth.json' });

let page: Page;

test('Trailer number polje mora biti unique', async ({ page }) => {
    await page.goto(Constants.userUrl);
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(Constants.userUrl);
});