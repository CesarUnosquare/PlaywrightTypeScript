import { PostgresClient } from './postgres-client';
import { MysqlClient } from './mysql-client';
import { DbClient } from '../core/base/base-db-client';

export enum DatabaseType {
    POSTGRES = 'postgres',
    MYSQL = 'mysql'
}

export class DbFactory {
    static createClient(type: DatabaseType): DbClient {
        switch (type) {
            case DatabaseType.POSTGRES:
                return new PostgresClient();
            case DatabaseType.MYSQL:
                return new MysqlClient();
            default:
                throw new Error(`Unsupported database type: ${type}`);
        }
    }
}