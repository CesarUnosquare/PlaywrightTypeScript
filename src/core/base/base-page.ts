import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../logging/logger';
import { env } from '../../../config/env';
import { Retry } from '../decorators/retry.decorator';
import { Log } from '../decorators/logger.decorator';

export abstract class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    @Log()
    @Retry()
    async navigate(path: string = ''): Promise<void> {
        const url = `${env.baseUrl}${path}`;
        logger.info(`Navigating to URL: ${url}`);
        await this.page.goto(url);
        await this.verifyPageLoaded();
    }

    abstract verifyPageLoaded(): Promise<void>;

    @Log()
    protected async clickElement(element: Locator): Promise<void> {
        await element.waitFor({ state: 'visible' });
        await element.click();
    }

    @Log()
    protected async fillField(element: Locator, text: string): Promise<void> {
        await element.waitFor({ state: 'visible' });
        await element.fill(text);
    }

    @Log()
    protected async verifyElementText(element: Locator, expectedText: string): Promise<void> {
        await expect(element).toHaveText(expectedText);
    }

    @Log()
    protected async takeScreenshot(name: string): Promise<void> {
        const screenshot = await this.page.screenshot();
        logger.attachScreenshot(name, screenshot);
    }
}