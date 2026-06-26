import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { Role } from '@prisma/client';
export declare class UsersService {
    private prisma;
    private supabase;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        data: ({
            _count: {
                chronicles: number;
            };
        } & {
            email: string;
            password: string;
            id: number;
            supabaseUid: string | null;
            name: string;
            isBlocked: boolean;
            role: import(".prisma/client").$Enums.Role;
            file_path: string | null;
        })[];
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
        email: string;
        id: number;
        name: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        id: number;
        supabaseUid: string | null;
        name: string;
        isBlocked: boolean;
        role: import(".prisma/client").$Enums.Role;
        file_path: string | null;
    }>;
    updateRole(id: number, newRole: Role): Promise<{
        email: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getUserRole(id: number): Promise<{
        role: import(".prisma/client").$Enums.Role;
    }>;
    findOne(id: number): Promise<{
        chronicles: {
            id: number;
            file_path: string | null;
            title: string;
            author: string;
            content: string;
            correo: string | null;
            materia: string | null;
            palabras_claves: string | null;
            year_presentacion: string | null;
            createdAt: Date;
            userId: number;
        }[];
        email: string;
        id: number;
        supabaseUid: string | null;
        name: string;
        isBlocked: boolean;
        role: import(".prisma/client").$Enums.Role;
        file_path: string | null;
    }>;
    countTotal(): Promise<number>;
    countBlocked(): Promise<number>;
}
