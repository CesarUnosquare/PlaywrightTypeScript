import { CustomError } from './custom-error';

export class DbError extends CustomError {
    constructor(
        message: string,
        public readonly query?: string,
        public readonly params?: any[]
    ) {
        super(message, 'DB_ERROR', { query, params });
    }
}