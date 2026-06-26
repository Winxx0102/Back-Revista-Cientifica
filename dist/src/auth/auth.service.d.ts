import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Response } from 'express';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    logout(res: any): {
        message: string;
        status: string;
    };
    private validateUser;
    login(email: string, pass: string, res: Response): Promise<{
        state: string;
        message: string;
        user: {
            email: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
}
