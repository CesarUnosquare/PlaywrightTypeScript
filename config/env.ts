interface EnvConfig {
    baseUrl: string;
    apiUrl: string;
    db: {
        postgres: {
            host: string;
            port: number;
            user: string;
            password: string;
            database: string;
        };
        mysql: {
            host: string;
            port: number;
            user: string;
            password: string;
            database: string;
        };
    };
    logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export const env: EnvConfig = {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    db: {
        postgres: {
            host: process.env.PG_HOST || 'localhost',
            port: parseInt(process.env.PG_PORT || '5432'),
            user: process.env.PG_USER || 'user',
            password: process.env.PG_PASSWORD || 'pass',
            database: process.env.PG_DB || 'testdb'
        },
        mysql: {
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            user: process.env.MYSQL_USER || 'user',
            password: process.env.MYSQL_PASSWORD || 'pass',
            database: process.env.MYSQL_DB || 'testdb'
        }
    },
    logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info'
};