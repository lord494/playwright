import { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly page:Page;
    readonly emailField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly forgottenPassword: Locator;
    readonly errorIndicator: Locator;
    readonly eyeIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailField = page.locator('[name="login"]');
        this.passwordField = page.locator('#password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.forgottenPassword = page.getByRole('link', { name: 'Forgotten password?' });
        this.errorIndicator = page.locator(".v-alert__content");
        this.eyeIcon = page.locator(".v-input__append-inner");
    }

    public async enterEmailAndPassword(user: {email: string, password: string}): Promise<void> {
        await this.emailField.fill(user.email);
        await this.passwordField.fill(user.password);
        await this.loginButton.click();
    }

    public async clickOnLoginButton(){
        await this.loginButton.click();
    }

    public async clickOnEyeIcon(){
        await this.eyeIcon.click();
    }

    public async clickOnForgottenPassword(){
        this.forgottenPassword.click();
    }
}