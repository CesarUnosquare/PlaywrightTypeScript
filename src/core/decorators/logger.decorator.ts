// src/core/decorators/logger.decorator.ts
import { logger } from '../logging/logger';

type Method = (...args: any[]) => Promise<any>;

export function Log() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<Method>
    ) {
        const originalMethod = descriptor.value;

        if (!originalMethod) {
            throw new Error(`@Log can only be applied to methods, but was applied to ${propertyKey}`);
        }

        descriptor.value = async function (...args: any[]) {
            const className = target.constructor.name;
            logger.debug(`Calling ${className}.${propertyKey} with args:`, args);
            
            try {
                const result = await originalMethod.apply(this, args);
                logger.debug(`Method ${className}.${propertyKey} succeeded`);
                return result;
            } catch (error) {
                logger.error(`Method ${className}.${propertyKey} failed:`, error);
                throw error;
            }
        };

        return descriptor;
    };
}