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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        const secret = configService.get('JWT_SECRET');
        console.log(`--- [JwtStrategy DEBUG] Secreto cargado: ${secret ? 'SÍ (longitud: ' + secret.length + ')' : 'NO CARGADO'}`);
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    console.log("--- [JwtStrategy] 1. Extrayendo cookie ---");
                    const token = request?.cookies?.['jwt'];
                    if (!token) {
                        console.log("[JwtStrategy] ¡ALERTA! La cookie 'jwt' es undefined o null.");
                    }
                    else {
                        console.log(`[JwtStrategy] Token encontrado. Longitud: ${token.length}. Inicio: ${token.substring(0, 10)}...`);
                    }
                    return token;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
        this.configService = configService;
        this.logger = new common_1.Logger(JwtStrategy_1.name);
    }
    async validate(payload) {
        console.log("--- [JwtStrategy] 2. Validación iniciada ---");
        if (!payload) {
            console.log("[JwtStrategy] ERROR: El token fue recibido pero la decodificación devolvió null/undefined.");
            throw new common_1.UnauthorizedException("Token inválido o corrupto");
        }
        console.log("[JwtStrategy] 3. Payload decodificado correctamente:", JSON.stringify(payload));
        if (!payload.sub) {
            console.log("[JwtStrategy] ERROR: El payload no contiene 'sub' (userId).");
            throw new common_1.UnauthorizedException("El token no contiene un ID de usuario válido");
        }
        console.log(`[JwtStrategy] 4. Mapeando usuario: ID=${payload.sub}, Email=${payload.email}`);
        return {
            userId: Number(payload.sub),
            email: payload.email,
            role: payload.role
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map