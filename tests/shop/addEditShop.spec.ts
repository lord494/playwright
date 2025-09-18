import { expect } from '@playwright/test';
import { Constants } from '../../helpers/constants';
import { test } from '../fixtures/fixtures';

test('Korisnik moze da doda Shop sa Any truck fransizom', async ({ shopWithDialog }) => {
    const { addShopPage } = shopWithDialog;
    const address = new RegExp(Constants.addressShop);
    await addShopPage.enterShopName(addShopPage.shopNameField, Constants.shopName);
    await addShopPage.selectFranchise(addShopPage.franchiseMenu, addShopPage.anyTruckFranchiseOption);
    await addShopPage.selectAddress(addShopPage.addressField, Constants.addressShop, addShopPage.addressOption);
    await addShopPage.check(addShopPage.partnerCategory);
    await addShopPage.check(addShopPage.truckTypeCheckobx);
    await addShopPage.check(addShopPage.nationalShopToggle);
    await addShopPage.enterWebSite(addShopPage.websiteField, Constants.shopWebsite);
    await addShopPage.enterEmail(addShopPage.emailField, Constants.testEmail);
    await addShopPage.enterPhoneNumber(addShopPage.phoneNumberField, Constants.adminPhone);
    await addShopPage.addShopButton.click();
    await addShopPage.addNewShopCard.waitFor({ state: 'visible', timeout: 5000 });
    await addShopPage.yesButtonInDialog.click();
    await addShopPage.backIcon.waitFor({ state: 'visible', timeout: 5000 });
    await expect(addShopPage.shopNamePart).toContainText(Constants.shopName);
    await expect(addShopPage.shopCategoryPart).toContainText(Constants.partnerStatus);
    await expect(addShopPage.franchisePart).toContainText(Constants.truckFranchise);
    await expect(addShopPage.addressPart).toContainText(address);
    await expect(addShopPage.phoneNumberPart).toContainText(Constants.formatedAdminPhone);
    await expect(addShopPage.shopTypePart).toContainText('TRUCK');
    await expect(addShopPage.websitePart).toContainText(Constants.shopWebsite);
    await expect(addShopPage.emailPart).toContainText(Constants.testEmail);
    await addShopPage.deleteShop();
});

test('Korisnik moze da doda Shop sa vise tipova shopa', async ({ shopWithDialog }) => {
    const { addShopPage } = shopWithDialog;
    const address = new RegExp(Constants.addressShop);
    await addShopPage.enterShopName(addShopPage.shopNameField, Constants.shopName);
    await addShopPage.selectFranchise(addShopPage.franchiseMenu, addShopPage.anyTruckFranchiseOption);
    await addShopPage.selectAddress(addShopPage.addressField, Constants.addressShop, addShopPage.addressOption);
    await addShopPage.check(addShopPage.partnerCategory);
    await addShopPage.check(addShopPage.truckTypeCheckobx);
    await addShopPage.check(addShopPage.towingTypeCheckbox);
    await addShopPage.check(addShopPage.mobileShopTypeCheckbox);
    await addShopPage.check(addShopPage.nationalShopToggle);
    await addShopPage.enterWebSite(addShopPage.websiteField, Constants.shopWebsite);
    await addShopPage.enterEmail(addShopPage.emailField, Constants.testEmail);
    await addShopPage.enterPhoneNumber(addShopPage.phoneNumberField, Constants.adminPhone);
    await addShopPage.addShopButton.click();
    await addShopPage.addNewShopCard.waitFor({ state: 'visible', timeout: 5000 });
    await addShopPage.yesButtonInDialog.click();
    await addShopPage.backIcon.waitFor({ state: 'visible', timeout: 5000 });
    await expect(addShopPage.shopNamePart).toContainText(Constants.shopName);
    await expect(addShopPage.shopCategoryPart).toContainText(Constants.partnerStatus);
    await expect(addShopPage.franchisePart).toContainText(Constants.truckFranchise);
    await expect(addShopPage.addressPart).toContainText(address);
    await expect(addShopPage.phoneNumberPart).toContainText(Constants.formatedAdminPhone);
    const shopTypes = ['TRUCK', 'MOBILE_SHOP', 'TOWING'];
    const count = await addShopPage.shopTypePart.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
        const text = (await addShopPage.shopTypePart.nth(i).textContent())?.trim();
        expect(shopTypes).toContain(text);
    };
    await expect(addShopPage.websitePart).toContainText(Constants.shopWebsite);
    await expect(addShopPage.emailPart).toContainText(Constants.testEmail);
    await addShopPage.deleteShop();
});

test('Shop name je obavezno polje', async ({ shopWithDialog }) => {
    const { addShopPage } = shopWithDialog;
    await addShopPage.selectFranchise(addShopPage.franchiseMenu, addShopPage.anyTruckFranchiseOption);
    await addShopPage.selectAddress(addShopPage.addressField, Constants.addressShop, addShopPage.addressOption);
    await addShopPage.check(addShopPage.partnerCategory);
    await addShopPage.check(addShopPage.truckTypeCheckobx);
    await addShopPage.check(addShopPage.towingTypeCheckbox);
    await addShopPage.check(addShopPage.mobileShopTypeCheckbox);
    await addShopPage.check(addShopPage.nationalShopToggle);
    await addShopPage.enterWebSite(addShopPage.websiteField, Constants.shopWebsite);
    await addShopPage.enterEmail(addShopPage.emailField, Constants.testEmail);
    await addShopPage.enterPhoneNumber(addShopPage.phoneNumberField, Constants.adminPhone);
    await addShopPage.addShopButton.click();
    await expect(addShopPage.errorMessage).toBeVisible();
    await expect(addShopPage.errorMessage).toContainText('The Name field is required');
});

test('Shop type je obavezno polje', async ({ shopWithDialog }) => {
    const { addShopPage } = shopWithDialog;
    await addShopPage.enterShopName(addShopPage.shopNameField, Constants.shopName);
    await addShopPage.selectFranchise(addShopPage.franchiseMenu, addShopPage.anyTruckFranchiseOption);
    await addShopPage.selectAddress(addShopPage.addressField, Constants.addressShop, addShopPage.addressOption);
    await addShopPage.check(addShopPage.partnerCategory);
    await addShopPage.check(addShopPage.nationalShopToggle);
    await addShopPage.enterWebSite(addShopPage.websiteField, Constants.shopWebsite);
    await addShopPage.enterEmail(addShopPage.emailField, Constants.testEmail);
    await addShopPage.enterPhoneNumber(addShopPage.phoneNumberField, Constants.adminPhone);
    await addShopPage.addShopButton.click();
    await expect(addShopPage.truckTypeCheckobx).toHaveClass('v-label theme--light error--text');
});

test('Address je obavezno polje', async ({ shopWithDialog }) => {
    const { addShopPage } = shopWithDialog;
    await addShopPage.enterShopName(addShopPage.shopNameField, Constants.shopName);
    await addShopPage.selectFranchise(addShopPage.franchiseMenu, addShopPage.anyTruckFranchiseOption);
    await addShopPage.check(addShopPage.truckTypeCheckobx);
    await addShopPage.check(addShopPage.partnerCategory);
    await addShopPage.check(addShopPage.nationalShopToggle);
    await addShopPage.enterWebSite(addShopPage.websiteField, Constants.shopWebsite);
    await addShopPage.enterEmail(addShopPage.emailField, Constants.testEmail);
    await addShopPage.enterPhoneNumber(addShopPage.phoneNumberField, Constants.adminPhone);
    await addShopPage.addShopButton.click();
    await expect(addShopPage.mapIcon).toHaveClass('v-icon notranslate mdi mdi-map-search theme--light error--text');
});

test('Korisnik moze da edituje Shop', async ({ shopWithDialog }) => {
    const { addShopPage } = shopWithDialog;
    await addShopPage.enterShopName(addShopPage.shopNameField, Constants.shopName);
    await addShopPage.selectFranchise(addShopPage.franchiseMenu, addShopPage.anyTruckFranchiseOption);
    await addShopPage.selectAddress(addShopPage.addressField, Constants.addressShop, addShopPage.addressOption);
    await addShopPage.check(addShopPage.goldCategory);
    await addShopPage.check(addShopPage.truckTypeCheckobx);
    await addShopPage.enterPhoneNumber(addShopPage.phoneNumberField, Constants.adminPhone);
    await addShopPage.addShopButton.click();
    await addShopPage.addNewShopCard.waitFor({ state: 'visible', timeout: 5000 });
    await addShopPage.yesButtonInDialog.click();
    await addShopPage.backIcon.waitFor({ state: 'visible', timeout: 5000 });
    await addShopPage.editShopButton.click();
    await addShopPage.shopNameField.clear();
    await addShopPage.enterShopName(addShopPage.shopNameField, Constants.editShopName);
    await addShopPage.selectFranchise(addShopPage.franchiseMenu, addShopPage.anyTrailerFranchiseOption);
    await addShopPage.check(addShopPage.partnerCategory);
    await addShopPage.check(addShopPage.truckTypeCheckobx);
    await addShopPage.check(addShopPage.towingTypeCheckbox);
    await addShopPage.check(addShopPage.mobileShopTypeCheckbox);
    await addShopPage.phoneNumberField.clear();
    await addShopPage.enterPhoneNumber(addShopPage.phoneNumberField, Constants.editAdminPhone);
    await addShopPage.editShopButtonInModal.click();
    await addShopPage.page.waitForLoadState('networkidle');
    await expect(addShopPage.shopNamePart).toContainText(Constants.editShopName);
    await expect(addShopPage.shopCategoryPart).toContainText(Constants.partnerStatus);
    await expect(addShopPage.franchisePart).toContainText(Constants.trailerFranchise);
    await expect(addShopPage.phoneNumberPart).toContainText(Constants.formatedEditAdminPhone);
    const shopTypes = ['TRUCK', 'MOBILE_SHOP', 'TOWING'];
    const count = await addShopPage.shopTypePart.count();
    expect(count).toBe(3);
    for (let i = 0; i < count; i++) {
        const text = (await addShopPage.shopTypePart.nth(i).textContent())?.trim();
        expect(shopTypes).toContain(text);
    };
    await addShopPage.deleteShop();
});

test('Korisnik moze da prebaci shop u Blacklisted', async ({ shopWithDialog }) => {
    const { addShopPage } = shopWithDialog;
    await addShopPage.enterShopName(addShopPage.shopNameField, Constants.shopName);
    await addShopPage.selectFranchise(addShopPage.franchiseMenu, addShopPage.anyTruckFranchiseOption);
    await addShopPage.selectAddress(addShopPage.addressField, Constants.addressShop, addShopPage.addressOption);
    await addShopPage.check(addShopPage.truckTypeCheckobx);
    await addShopPage.check(addShopPage.nationalShopToggle);
    await addShopPage.enterWebSite(addShopPage.websiteField, Constants.shopWebsite);
    await addShopPage.enterEmail(addShopPage.emailField, Constants.testEmail);
    await addShopPage.enterPhoneNumber(addShopPage.phoneNumberField, Constants.adminPhone);
    await addShopPage.addShopButton.click();
    await addShopPage.addNewShopCard.waitFor({ state: 'visible', timeout: 5000 });
    await addShopPage.yesButtonInDialog.click();
    await addShopPage.backIcon.waitFor({ state: 'visible', timeout: 5000 });
    await expect(addShopPage.changeShopStatusButton).toBeVisible({ timeout: 5000 });
    await addShopPage.moveShopToBlackedList();
    await expect(addShopPage.shopCategoryPart).toContainText("BLACKLISTED");
    await addShopPage.deleteShop();
});
