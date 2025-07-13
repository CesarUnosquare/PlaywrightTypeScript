import { faker } from '@faker-js/faker';
import { User } from '../../models/user.model';

export class UserFactory {
    static create(overrides: Partial<User> = {}): User {
        const defaultUser: User = {
            id: faker.number.int(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: faker.internet.password(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return { ...defaultUser, ...overrides };
    }

    static createMany(count: number, overrides: Partial<User> = {}): User[] {
        return Array.from({ length: count }, () => this.create(overrides));
    }
}