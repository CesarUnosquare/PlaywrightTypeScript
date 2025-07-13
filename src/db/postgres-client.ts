import { Pool, PoolClient } from 'pg';
import { BaseDbClient } from '../core/base/base-db-client';
import { env } from '../../config/env';
import { DbError } from '../core/exceptions/db-error';

export class PostgresClient extends BaseDbClient {
    private pool: Pool;
    private client?: PoolClient;

    constructor() {
        super();
        this.pool = new Pool({
            host: env.db.postgres.host,
            port: env.db.postgres.port,
            user: env.db.postgres.user,
            password: env.db.postgres.password,
            database: env.db.postgres.database,
            max: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000
        });
    }

    async connect(): Promise<void> {
        try {
            this.client = await this.pool.connect();
            this.connected = true;
        } catch (error) {
            throw new DbError('Failed to connect to PostgreSQL', undefined, undefined, error as Error);
        }
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.release();
            this.client = undefined;
        }
        await this.pool.end();
        this.connected = false;
    }

    async query(sql: string, params?: any[]): Promise<any> {
        if (!this.connected || !this.client) {
            throw new DbError('Database not connected');
        }

        try {
            return await this.client.query(sql, params);
        } catch (error) {
            throw new DbError('Query failed', sql, params, error as Error);
        }
    }

    protected async beginTransaction(): Promise<void> {
        await this.query('BEGIN');
    }

    protected async commitTransaction(): Promise<void> {
        await this.query('COMMIT');
    }

    protected async rollbackTransaction(): Promise<void> {
        await this.query('ROLLBACK');
    }
}