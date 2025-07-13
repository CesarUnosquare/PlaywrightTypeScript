import { CustomError } from './custom-error';

export class ApiError extends CustomError {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly response?: any
    ) {
        super(message, 'API_ERROR', response);
    }
}