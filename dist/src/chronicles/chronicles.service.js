"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChroniclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ChroniclesService = class ChroniclesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createChronicleDto) {
        return this.prisma.chronicles.create({
            data: createChronicleDto,
        });
    }
    findAll() {
        return this.prisma.chronicles.findMany();
    }
    findOne(id) {
        return this.prisma.chronicles.findUnique({
            where: { id },
        });
    }
    update(id, updateChronicleDto) {
        return this.prisma.chronicles.update({
            where: { id },
            data: updateChronicleDto,
        });
    }
    remove(id) {
        return this.prisma.chronicles.delete({
            where: { id },
        });
    }
    async findByUser(userId) {
        if (typeof userId !== 'number' || isNaN(userId)) {
            throw new Error("El ID proporcionado debe ser un número válido");
        }
        return this.prisma.chronicles.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.ChroniclesService = ChroniclesService;
exports.ChroniclesService = ChroniclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChroniclesService);
//# sourceMappingURL=chronicles.service.js.map