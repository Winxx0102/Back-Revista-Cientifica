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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('[RolesGuard] Roles requeridos:', requiredRoles);
        if (!requiredRoles || requiredRoles.length === 0) {
            console.log('[RolesGuard] No se requieren roles, acceso permitido.');
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log('[RolesGuard] Usuario detectado en el Request:', user);
        if (!user) {
            console.log('[RolesGuard] ERROR: El usuario es undefined. ¿Pasó el JwtAuthGuard?');
            throw new common_1.ForbiddenException('No hay usuario autenticado');
        }
        const userRole = user.role;
        console.log(`[RolesGuard] Verificando rol. Usuario tiene: '${userRole}'`);
        const hasRole = requiredRoles.includes(userRole);
        if (!hasRole) {
            console.log(`[RolesGuard] ERROR: '${userRole}' no está en la lista de permitidos: [${requiredRoles.join(', ')}]`);
            throw new common_1.ForbiddenException(`Se requiere al menos uno de estos roles: ${requiredRoles.join(', ')}. Tu rol actual: ${userRole}`);
        }
        console.log('[RolesGuard] ¡Éxito! Rol validado correctamente.');
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map