import { UsersService } from './user.service';
import { CreateUserDto, Role } from './dto/user.dto';
import { ChroniclesService } from '../chronicles/chronicles.service';
export declare class UsersController {
    private readonly usersService;
    private readonly chroniclesService;
    constructor(usersService: UsersService, chroniclesService: ChroniclesService);
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
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        id: number;
        name: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getProfile(userId: number): Promise<{
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
        email: string;
        id: number;
        role: import(".prisma/client").$Enums.Role;
    }>;
    getStats(): Promise<{
        totalchronicles: number;
        totalUsers: number;
        blockedUsers: number;
    }>;
}
