import { BaseApiClient } from '../core/base/base-api-client';
import { User } from '../models/user.model';

export class UsersApiClient extends BaseApiClient {
    private readonly basePath = '/users';

    async getAllUsers(): Promise<User[]> {
        const response = await this.get<User[]>(this.basePath);
        return response.data;
    }

    async getUserById(id: number): Promise<User> {
        const response = await this.get<User>(`${this.basePath}/${id}`);
        return response.data;
    }

    async createUser(user: Omit<User, 'id'>): Promise<User> {
        const response = await this.post<User>(this.basePath, user);
        return response.data;
    }

    async updateUser(id: number, user: Partial<User>): Promise<User> {
        const response = await this.put<User>(`${this.basePath}/${id}`, user);
        return response.data;
    }

    async deleteUser(id: number): Promise<void> {
        await this.delete<void>(`${this.basePath}/${id}`);
    }
}