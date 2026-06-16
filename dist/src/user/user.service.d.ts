import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { Role } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        data: {
            id: number;
            email: string;
            name: string;
            password: string;
            isBlocked: boolean;
            role: import(".prisma/client").$Enums.Role;
        }[];
        totalPages: number;
    }>;
    blockUser(id: number): Promise<{
        status: string;
        message: string;
    }>;
    unBlockUser(id: number): Promise<{
        status: string;
        message: string;
    }>;
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    findByEmail(email: string): Promise<{
        id: number;
        email: string;
        name: string;
        password: string;
        isBlocked: boolean;
        role: import(".prisma/client").$Enums.Role;
    }>;
    updateRole(id: number, newRole: Role): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getUserRole(id: number): Promise<{
        role: import(".prisma/client").$Enums.Role;
    }>;
    findOne(id: number): Promise<{
        chronicles: {
            id: number;
            userId: number;
            title: string;
            author: string;
            content: string;
            createdAt: Date;
        }[];
        id: number;
        email: string;
        name: string;
        isBlocked: boolean;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
