import { PlaywrightTestConfig, devices } from '@playwright/test';
import { env } from '../config/env';
import 'dotenv/config';

const config: PlaywrightTestConfig = {
    timeout: 60000,
    globalTimeout: 600000,
    expect: {
        timeout: 10000
    },
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 4 : undefined,
    reporter: [
        ['list'],
        ['html', { 
            outputFolder: 'src/reports/html',
            open: process.env.CI ? 'never' : 'on-failure'
        }],
        ['allure-playwright', {
            detail: true,
            outputFolder: 'src/reports/allure',
            suiteTitle: false
        }]
    ],
    globalSetup: require.resolve('./src/core/setup/global-setup'),
    globalTeardown: require.resolve('./src/core/setup/global-teardown'),
    use: {
        baseURL: env.baseUrl,
        headless: true,
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        acceptDownloads: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        actionTimeout: 10000,
        navigationTimeout: 30000,
    },
    projects: [
        {
            name: 'chromium',
            use: { 
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: ['--start-maximized']
                }
            },
        },
        {
            name: 'firefox',
            use: { 
                ...devices['Desktop Firefox'],
                launchOptions: {
                    args: ['--start-maximized']
                }
            },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        }
    ]
};

export default config;