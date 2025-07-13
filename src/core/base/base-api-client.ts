import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { logger } from '../logging/logger';
import { ApiError } from '../exceptions/api-error';
import { Retry } from '../decorators/retry.decorator';
import { Log } from '../decorators/logger.decorator';
import { env } from '../../../config/env';

export abstract class BaseApiClient {
    protected readonly client: AxiosInstance;

    constructor(baseURL: string = env.apiUrl) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.client.interceptors.request.use(config => {
            logger.debug(`Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        });

        // Response interceptor
        this.client.interceptors.response.use(
            response => {
                logger.debug(`Response: ${response.status} ${response.config.url}`);
                return response;
            },
            (error: AxiosError) => {
                if (error.response) {
                    throw new ApiError(
                        `API Error: ${error.response.status} ${error.config?.url}`,
                        error.response.status,
                        error.response.data
                    );
                }
                throw new ApiError(`Network Error: ${error.message}`, 0);
            }
        );
    }

    @Log()
    @Retry()
    protected async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
        const response = await this.client.get<T>(url, { params });
        return response.data;
    }

    @Log()
    @Retry()
    protected async post<T>(url: string, data: unknown, config?: Record<string, unknown>): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    @Log()
    @Retry()
    protected async put<T>(url: string, data: unknown): Promise<T> {
        const response = await this.client.put<T>(url, data);
        return response.data;
    }

    @Log()
    @Retry()
    protected async delete<T>(url: string): Promise<void> {
        await this.client.delete(url);
    }
}