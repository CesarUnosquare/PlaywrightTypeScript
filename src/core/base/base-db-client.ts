// src/core/base/base-db-client.ts
import { logger } from '../logging/logger';
import { DbError } from '../exceptions/db-error';
import { Log } from '../decorators/logger.decorator';
import { Retry } from '../decorators/retry.decorator';

export interface DbClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query<T = any>(sql: string, params?: any[]): Promise<T>;
    executeTransaction(queries: { sql: string; params?: any[] }[]): Promise<void>;
}

export abstract class BaseDbClient implements DbClient {
    protected connected: boolean = false;
    protected transactionInProgress: boolean = false;

    // Métodos abstractos sin decoradores
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract query<T = any>(sql: string, params?: any[]): Promise<T>;
    abstract beginTransaction(): Promise<void>;
    abstract commitTransaction(): Promise<void>;
    abstract rollbackTransaction(): Promise<void>;

    // Métodos implementados con decoradores
    @Log()
    @Retry(2, 1500)
    async executeTransaction(queries: { sql: string; params?: any[] }[]): Promise<void> {
        if (!this.connected) {
            throw new DbError('Database not connected');
        }

        if (this.transactionInProgress) {
            throw new DbError('Transaction already in progress');
        }

        try {
            await this.beginTransaction();
            this.transactionInProgress = true;

            for (const { sql, params } of queries) {
                try {
                    await this.query(sql, params);
                } catch (error) {
                    throw new DbError(`Query failed in transaction: ${sql}`, sql, params);
                }
            }

            await this.commitTransaction();
            this.transactionInProgress = false;
        } catch (error) {
            if (this.transactionInProgress) {
                await this.rollbackTransaction().catch(rollbackError => {
                    logger.error('Failed to rollback transaction:', rollbackError);
                });
                this.transactionInProgress = false;
            }
            throw error;
        }
    }

    protected validateConnection(): void {
        if (!this.connected) {
            throw new DbError('Database not connected');
        }
    }
}