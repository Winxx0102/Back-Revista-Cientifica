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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChroniclesController = void 0;
const common_1 = require("@nestjs/common");
const chronicles_service_1 = require("./chronicles.service");
const create_chronicle_dto_1 = require("./dto/create-chronicle.dto");
const update_chronicle_dto_1 = require("./dto/update-chronicle.dto");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
let ChroniclesController = class ChroniclesController {
    constructor(chroniclesService) {
        this.chroniclesService = chroniclesService;
    }
    create(createChronicleDto) {
        return this.chroniclesService.create(createChronicleDto);
    }
    findAll() {
        return this.chroniclesService.findAll();
    }
    findOne(id) {
        return this.chroniclesService.findOne(+id);
    }
    async getMyChronicles(req) {
        const userId = req.user.userId;
        console.log("ID extraído con éxito:", userId);
        return this.chroniclesService.findByUser(Number(userId));
    }
    update(id, updateChronicleDto) {
        return this.chroniclesService.update(+id, updateChronicleDto);
    }
    remove(id) {
        return this.chroniclesService.remove(+id);
    }
};
exports.ChroniclesController = ChroniclesController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN, client_1.Role.USER),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chronicle_dto_1.CreateChronicleDto]),
    __metadata("design:returntype", void 0)
], ChroniclesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChroniclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChroniclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('my/list'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChroniclesController.prototype, "getMyChronicles", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_chronicle_dto_1.UpdateChronicleDto]),
    __metadata("design:returntype", void 0)
], ChroniclesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.SUPERADMIN, client_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChroniclesController.prototype, "remove", null);
exports.ChroniclesController = ChroniclesController = __decorate([
    (0, common_1.Controller)('chronicles'),
    __metadata("design:paramtypes", [chronicles_service_1.ChroniclesService])
], ChroniclesController);
//# sourceMappingURL=chronicles.controller.js.map