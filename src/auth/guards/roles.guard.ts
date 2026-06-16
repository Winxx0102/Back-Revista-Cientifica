import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // --- DEBUG 1: ¿Qué espera este endpoint? ---
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
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

    // --- DEBUG 2: ¿Quién es el usuario? ---
    console.log('[RolesGuard] Usuario detectado en el Request:', user);

    if (!user) {
      console.log('[RolesGuard] ERROR: El usuario es undefined. ¿Pasó el JwtAuthGuard?');
      throw new ForbiddenException('No hay usuario autenticado');
    }

    const userRole = user.role;
    console.log(`[RolesGuard] Verificando rol. Usuario tiene: '${userRole}'`);

    // --- DEBUG 3: ¿Coincide el rol? ---
    const hasRole = requiredRoles.includes(userRole as Role);
    
    if (!hasRole) {
      console.log(`[RolesGuard] ERROR: '${userRole}' no está en la lista de permitidos: [${requiredRoles.join(', ')}]`);
      throw new ForbiddenException(
        `Se requiere al menos uno de estos roles: ${requiredRoles.join(', ')}. Tu rol actual: ${userRole}`
      );
    }

    console.log('[RolesGuard] ¡Éxito! Rol validado correctamente.');
    return true;
  }
}