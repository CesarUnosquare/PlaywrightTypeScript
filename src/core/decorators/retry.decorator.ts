// src/core/decorators/retry.decorator.ts
import { logger } from '../logging/logger';

type Method = (...args: any[]) => Promise<any>;

export function Retry(maxAttempts: number = 3, delayMs: number = 1000) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<Method>
    ) {
        const originalMethod = descriptor.value;

        if (!originalMethod) {
            throw new Error(`@Retry can only be applied to methods, but was applied to ${propertyKey}`);
        }

        descriptor.value = async function (...args: any[]) {
            let lastError: Error | null = null;
            
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    logger.debug(`Attempt ${attempt}/${maxAttempts} for ${target.constructor.name}.${propertyKey}`);
                    return await originalMethod.apply(this, args);
                } catch (error) {
                    lastError = error as Error;
                    if (attempt < maxAttempts) {
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                    }
                }
            }
            
            throw lastError || new Error(`Failed after ${maxAttempts} attempts`);
        };

        return descriptor;
    };
}