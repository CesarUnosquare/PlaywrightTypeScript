import { env } from '../../../config/env';

export class Logger {
    private static instance: Logger;
    private logLevel: number;

    private constructor() {
        this.logLevel = this.getLogLevelValue(env.logLevel);
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private getLogLevelValue(level: string): number {
        const levels: Record<string, number> = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
        return levels[level] || 2;
    }

    private log(level: string, message: string, ...args: any[]): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...args);
    }

    public error(message: string, ...args: any[]): void {
        if (this.logLevel >= 0) this.log('error', message, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        if (this.logLevel >= 1) this.log('warn', message, ...args);
    }

    public info(message: string, ...args: any[]): void {
        if (this.logLevel >= 2) this.log('info', message, ...args);
    }

    public debug(message: string, ...args: any[]): void {
        if (this.logLevel >= 3) this.log('debug', message, ...args);
    }
}

export const logger = Logger.getInstance();