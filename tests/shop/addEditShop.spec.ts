import { test, expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { AddShopPage } from '../../page/shop/addShop.page';
import { ShopPage } from '../../page/shop/shopOvervirew.page';

test.use({ storageState: 'auth.json' });

test.beforeEach(async ({ page }) => {
    const shop = new ShopPage(page);
    const addShop = new AddShopPage(page);
    await page.goto(Constants.shopUrl, { waitUntil: 'networkidle' });
    await shop.addNewShopButton.click();
    await addShop.activeDialogbox.waitFor({ state: 'visible', timeout: 5000 });
});

test('Korisnik moze da doda Shop sa Any truck fransizom', async ({ page }) => {
    const addShop = new AddShopPage(page);
    const address = new RegExp(Constants.addressShop);
    await addShop.enterShopName(addShop.shopNameField, Constants.shopName);
    await addShop.selectFranchise(addShop.franchiseMenu, addShop.anyTruckFranchiseOption);
    await addShop.selectAddress(addShop.addressField, Constants.addressShop, addShop.addressOption);
    await addShop.check(addShop.partnerCategory);
    await addShop.check(addShop.truckTypeCheckobx);
    await addShop.check(addShop.nationalShopToggle);
    await addShop.enterWebSite(addShop.websiteField, Constants.shopWebsite);
    await addShop.enterEmail(addShop.emailField, Constants.testEmail);
    await addShop.enterPhoneNumber(addShop.phoneNumberField, Constants.adminPhone);
    await addShop.addShopButton.click();
    await addShop.addNewShopCard.waitFor({ state: 'visible', timeout: 5000 });
    await addShop.yesButtonInDialog.click();
    await addShop.backIcon.waitFor({ state: 'visible', timeout: 5000 });
    await expect(addShop.shopNamePart).toContainText(Constants.shopName);
    await expect(addShop.shopCategoryPart).toContainText(Constants.partnerStatus);
    await expect(addShop.franchisePart).toContainText(Constants.truckFranchise);
    await expect(addShop.addressPart).toContainText(address);
    await expect(addShop.phoneNumberPart).toContainText(Constants.formatedAdminPhone);
    await expect(addShop.shopTypePart).toContainText('TRUCK');
    await expect(addShop.websitePart).toContainText(Constants.shopWebsite);
    await expect(addShop.emailPart).toContainText(Constants.testEmail);
    await addShop.deleteShop();
});

test('Korisnik moze da doda Shop sa vise tipova shopa', async ({ page }) => {
    const addShop = new AddShopPage(page);
    const address = new RegExp(Constants.addressShop);
    await addShop.enterShopName(addShop.shopNameField, Constants.shopName);
    await addShop.selectFranchise(addShop.franchiseMenu, addShop.anyTruckFranchiseOption);
    await addShop.selectAddress(addShop.addressField, Constants.addressShop, addShop.addressOption);
    await addShop.check(addShop.partnerCategory);
    await addShop.check(addShop.truckTypeCheckobx);
    await addShop.check(addShop.towingTypeCheckbox);
    await addShop.check(addShop.mobileShopTypeCheckbox);
    await addShop.check(addShop.nationalShopToggle);
    await addShop.enterWebSite(addShop.websiteField, Constants.shopWebsite);
    await addShop.enterEmail(addShop.emailField, Constants.testEmail);
    await addShop.enterPhoneNumber(addShop.phoneNumberField, Constants.adminPhone);
    await addShop.addShopButton.click();
    await addShop.addNewShopCard.waitFor({ state: 'visible', timeout: 5000 });
    await addShop.yesButtonInDialog.click();
    await addShop.backIcon.waitFor({ state: 'visible', timeout: 5000 });
    await expect(addShop.shopNamePart).toContainText(Constants.shopName);
    await expect(addShop.shopCategoryPart).toContainText(Constants.partnerStatus);
    await expect(addShop.franchisePart).toContainText(Constants.truckFranchise);
    await expect(addShop.addressPart).toContainText(address);
    await expect(addShop.phoneNumberPart).toContainText(Constants.formatedAdminPhone);
    const shopTypes = ['TRUCK', 'MOBILE_SHOP', 'TOWING'];
    const count = await addShop.shopTypePart.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
        const text = (await addShop.shopTypePart.nth(i).textContent())?.trim();
        expect(shopTypes).toContain(text);
    };
    await expect(addShop.websitePart).toContainText(Constants.shopWebsite);
    await expect(addShop.emailPart).toContainText(Constants.testEmail);
    await addShop.deleteShop();
});

test('Shop name je obavezno polje', async ({ page }) => {
    const addShop = new AddShopPage(page);
    await addShop.selectFranchise(addShop.franchiseMenu, addShop.anyTruckFranchiseOption);
    await addShop.selectAddress(addShop.addressField, Constants.addressShop, addShop.addressOption);
    await addShop.check(addShop.partnerCategory);
    await addShop.check(addShop.truckTypeCheckobx);
    await addShop.check(addShop.towingTypeCheckbox);
    await addShop.check(addShop.mobileShopTypeCheckbox);
    await addShop.check(addShop.nationalShopToggle);
    await addShop.enterWebSite(addShop.websiteField, Constants.shopWebsite);
    await addShop.enterEmail(addShop.emailField, Constants.testEmail);
    await addShop.enterPhoneNumber(addShop.phoneNumberField, Constants.adminPhone);
    await addShop.addShopButton.click();
    await expect(addShop.errorMessage).toBeVisible();
    await expect(addShop.errorMessage).toContainText('The Name field is required');
});

test('Shop type je obavezno polje', async ({ page }) => {
    const addShop = new AddShopPage(page);
    await addShop.enterShopName(addShop.shopNameField, Constants.shopName);
    await addShop.selectFranchise(addShop.franchiseMenu, addShop.anyTruckFranchiseOption);
    await addShop.selectAddress(addShop.addressField, Constants.addressShop, addShop.addressOption);
    await addShop.check(addShop.partnerCategory);
    await addShop.check(addShop.nationalShopToggle);
    await addShop.enterWebSite(addShop.websiteField, Constants.shopWebsite);
    await addShop.enterEmail(addShop.emailField, Constants.testEmail);
    await addShop.enterPhoneNumber(addShop.phoneNumberField, Constants.adminPhone);
    await addShop.addShopButton.click();
    await expect(addShop.truckTypeCheckobx).toHaveClass('v-label theme--light error--text');
});

test('Address je obavezno polje', async ({ page }) => {
    const addShop = new AddShopPage(page);
    await addShop.enterShopName(addShop.shopNameField, Constants.shopName);
    await addShop.selectFranchise(addShop.franchiseMenu, addShop.anyTruckFranchiseOption);
    await addShop.check(addShop.truckTypeCheckobx);
    await addShop.check(addShop.partnerCategory);
    await addShop.check(addShop.nationalShopToggle);
    await addShop.enterWebSite(addShop.websiteField, Constants.shopWebsite);
    await addShop.enterEmail(addShop.emailField, Constants.testEmail);
    await addShop.enterPhoneNumber(addShop.phoneNumberField, Constants.adminPhone);
    await addShop.addShopButton.click();
    await expect(addShop.mapIcon).toHaveClass('v-icon notranslate mdi mdi-map-search theme--light error--text');
});

test('Korisnik moze da edituje Shop', async ({ page }) => {
    const addShop = new AddShopPage(page);
    await addShop.enterShopName(addShop.shopNameField, Constants.shopName);
    await addShop.selectFranchise(addShop.franchiseMenu, addShop.anyTruckFranchiseOption);
    await addShop.selectAddress(addShop.addressField, Constants.addressShop, addShop.addressOption);
    await addShop.check(addShop.goldCategory);
    await addShop.check(addShop.truckTypeCheckobx);
    await addShop.enterPhoneNumber(addShop.phoneNumberField, Constants.adminPhone);
    await addShop.addShopButton.click();
    await addShop.addNewShopCard.waitFor({ state: 'visible', timeout: 5000 });
    await addShop.yesButtonInDialog.click();
    await addShop.backIcon.waitFor({ state: 'visible', timeout: 5000 });
    await addShop.editShopButton.click();
    await addShop.shopNameField.clear();
    await addShop.enterShopName(addShop.shopNameField, Constants.editShopName);
    await addShop.selectFranchise(addShop.franchiseMenu, addShop.anyTrailerFranchiseOption);
    await addShop.check(addShop.partnerCategory);
    await addShop.check(addShop.truckTypeCheckobx);
    await addShop.check(addShop.towingTypeCheckbox);
    await addShop.check(addShop.mobileShopTypeCheckbox);
    await addShop.phoneNumberField.clear();
    await addShop.enterPhoneNumber(addShop.phoneNumberField, Constants.editAdminPhone);
    await addShop.editShopButtonInModal.click();
    await page.waitForLoadState('networkidle');
    await expect(addShop.shopNamePart).toContainText(Constants.editShopName);
    await expect(addShop.shopCategoryPart).toContainText(Constants.partnerStatus);
    await expect(addShop.franchisePart).toContainText(Constants.trailerFranchise);
    await expect(addShop.phoneNumberPart).toContainText(Constants.formatedEditAdminPhone);
    const shopTypes = ['TRUCK', 'MOBILE_SHOP', 'TOWING'];
    const count = await addShop.shopTypePart.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
        const text = (await addShop.shopTypePart.nth(i).textContent())?.trim();
        expect(shopTypes).toContain(text);
    };
    await addShop.deleteShop();
});

test('Korisnik moze da prebaci shop u Blacklisted', async ({ page }) => {
    const addShop = new AddShopPage(page);
    await addShop.enterShopName(addShop.shopNameField, Constants.shopName);
    await addShop.selectFranchise(addShop.franchiseMenu, addShop.anyTruckFranchiseOption);
    await addShop.selectAddress(addShop.addressField, Constants.addressShop, addShop.addressOption);
    await addShop.check(addShop.truckTypeCheckobx);
    await addShop.check(addShop.nationalShopToggle);
    await addShop.enterWebSite(addShop.websiteField, Constants.shopWebsite);
    await addShop.enterEmail(addShop.emailField, Constants.testEmail);
    await addShop.enterPhoneNumber(addShop.phoneNumberField, Constants.adminPhone);
    await addShop.addShopButton.click();
    await addShop.addNewShopCard.waitFor({ state: 'visible', timeout: 5000 });
    await addShop.yesButtonInDialog.click();
    await addShop.backIcon.waitFor({ state: 'visible', timeout: 5000 });
    await expect(addShop.changeShopStatusButton).toBeVisible({ timeout: 5000 });
    await addShop.moveShopToBlackedList();
    await expect(addShop.shopCategoryPart).toContainText("BLACKLISTED");
    await addShop.deleteShop();
});
