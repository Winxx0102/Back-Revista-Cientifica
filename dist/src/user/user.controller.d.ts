import { UsersService } from './user.service';
import { CreateUserDto, Role } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    create(createUserDto: CreateUserDto): Promise<{
        id: number;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getProfile(userId: number): Promise<{
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
    getUserRole(req: any): Promise<{
        role: import(".prisma/client").$Enums.Role;
    }>;
    blockUser(id: number): Promise<{
        status: string;
        message: string;
    }>;
    unBlockUser(id: number): Promise<{
        status: string;
        message: string;
    }>;
    updateRole(id: number, role: Role): Promise<{
        id: number;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
