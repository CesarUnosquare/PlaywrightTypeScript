export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserDto {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    isActive?: boolean;
}