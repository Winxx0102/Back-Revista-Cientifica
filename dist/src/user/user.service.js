"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const supabase_js_1 = require("@supabase/supabase-js");
function getPagination(query) {
    const take = query.take !== undefined ? Number(query.take) : 10;
    const page = query.page !== undefined ? Number(query.page) : 1;
    const skip = query.skip !== undefined ? Number(query.skip) : (page - 1) * take;
    return { take, page, skip };
}
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    }
    async findAll(query) {
        const search = query.search || '';
        const where = {};
        const { take, page, skip } = getPagination(query);
        if (query.search) {
            where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
        }
        const data = await this.prisma.user.findMany({
            where,
            take,
            skip,
            include: { _count: { select: { chronicles: true } } }
        });
        const totalPages = await this.prisma.user.count({ where });
        return { data, totalPages };
    }
    async blockUser(id) {
        await this.prisma.user.update({ where: { id }, data: { isBlocked: true } });
        return { status: 'success', message: 'Usuario Bloqueado' };
    }
    async unBlockUser(id) {
        await this.prisma.user.update({ where: { id }, data: { isBlocked: false } });
        return { status: 'success', message: 'Usuario Desbloqueado' };
    }
    async create(createUserDto) {
        const { email, password, name } = createUserDto;
        const existingUser = await this.prisma.user.findFirst({
            where: { OR: [{ email }, { name }] }
        });
        if (existingUser)
            throw new common_1.ConflictException('Las credenciales están registradas');
        const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: { role: 'USER' },
            email_confirm: true,
        });
        if (authError)
            throw new common_1.BadRequestException(authError.message);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: "USER",
                supabaseUid: authData.user.id,
            },
            select: { id: true, email: true, name: true, role: true },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async updateRole(id, newRole) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        try {
            if (user.supabaseUid) {
                await this.supabase.auth.admin.updateUserById(user.supabaseUid, {
                    user_metadata: { role: newRole }
                });
            }
            return await this.prisma.user.update({
                where: { id },
                data: { role: newRole },
                select: { id: true, email: true, role: true },
            });
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            throw new common_1.BadRequestException(`Error al actualizar el rol: ${msg}`);
        }
    }
    async getUserRole(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return { role: user.role };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { chronicles: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const { password, ...result } = user;
        return result;
    }
    async countTotal() {
        return await this.prisma.user.count();
    }
    async countBlocked() {
        return await this.prisma.user.count({ where: { isBlocked: true } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=user.service.js.map