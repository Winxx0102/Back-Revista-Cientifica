import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, res: Response): Promise<{
        access_token: {
            state: string;
            message: string;
            user: {
                email: string;
                role: import(".prisma/client").$Enums.Role;
            };
        };
        message: string;
    }>;
    logout(res: Response): Promise<{
        message: string;
        status: string;
    }>;
    verifySession(req: any): {
        user: any;
    };
}
