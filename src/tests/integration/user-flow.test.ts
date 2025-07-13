import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import { DashboardPage } from '../../pages/dashboard-page';
import { UsersApiClient } from '../../api/users-api-client';
import { UserFactory } from '../../core/factories/user-factory';
import { DbFactory, DatabaseType } from '../../db/db-factory';
import { logger } from '../../core/logging/logger';

test.describe('User Flow Integration Test', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let usersApi: UsersApiClient;
    let dbClient: DbClient;
    let testUser: User;

    test.beforeAll(async () => {
        usersApi = new UsersApiClient();
        dbClient = DbFactory.createClient(DatabaseType.POSTGRES);
        await dbClient.connect();
        
        // Create test user in DB and API
        testUser = UserFactory.create();
        await dbClient.query(
            'INSERT INTO users (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5)',
            [testUser.username, testUser.email, testUser.firstName, testUser.lastName, testUser.password]
        );
    });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.navigate();
    });

    test('Complete user flow', async () => {
        // Login via UI
        await loginPage.login(testUser.username, testUser.password);
        await dashboardPage.verifyPageLoaded();
        
        // Verify user data via API
        const apiUser = await usersApi.getUserByUsername(testUser.username);
        expect(apiUser.email).toBe(testUser.email);
        
        // Verify user in database
        const dbUser = await dbClient.query('SELECT * FROM users WHERE username = $1', [testUser.username]);
        expect(dbUser.rows[0].email).toBe(testUser.email);
        
        // Update user via API
        const updatedData = { firstName: 'UpdatedName' };
        await usersApi.updateUser(apiUser.id, updatedData);
        
        // Verify update in UI
        await dashboardPage.verifyUserProfile(`${updatedData.firstName} ${testUser.lastName}`);
    });

    test.afterAll(async () => {
        // Cleanup
        try {
            await dbClient.query('DELETE FROM users WHERE username = $1', [testUser.username]);
            await dbClient.disconnect();
        } catch (error) {
            logger.error('Cleanup failed:', error);
        }
    });
});