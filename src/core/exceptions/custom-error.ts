export class CustomError extends Error {
    constructor(message: string, public readonly code: string, public readonly details?: any) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}