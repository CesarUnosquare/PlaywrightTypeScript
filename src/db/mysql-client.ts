import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import { BaseDbClient } from '../core/base/base-db-client';
import { env } from '../../config/env';
import { DbError } from '../core/exceptions/db-error';

export class MysqlClient extends BaseDbClient {
    private pool: Pool;
    private connection?: PoolConnection;

    constructor() {
        super();
        this.pool = mysql.createPool({
            host: env.db.mysql.host,
            port: env.db.mysql.port,
            user: env.db.mysql.user,
            password: env.db.mysql.password,
            database: env.db.mysql.database,
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0
        });
    }

    async connect(): Promise<void> {
        try {
            this.connection = await this.pool.getConnection();
            this.connected = true;
        } catch (error) {
            throw new DbError('Failed to connect to MySQL', undefined, undefined, error as Error);
        }
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.release();
            this.connection = undefined;
        }
        await this.pool.end();
        this.connected = false;
    }

    async query(sql: string, params?: any[]): Promise<any> {
        if (!this.connected || !this.connection) {
            throw new DbError('Database not connected');
        }

        try {
            const [rows] = await this.connection.query(sql, params);
            return rows;
        } catch (error) {
            throw new DbError('Query failed', sql, params, error as Error);
        }
    }

    protected async beginTransaction(): Promise<void> {
        await this.query('START TRANSACTION');
    }

    protected async commitTransaction(): Promise<void> {
        await this.query('COMMIT');
    }

    protected async rollbackTransaction(): Promise<void> {
        await this.query('ROLLBACK');
    }
}