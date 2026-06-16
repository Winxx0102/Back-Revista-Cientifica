import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    
    // Debug del secreto cargado
    console.log(`--- [JwtStrategy DEBUG] Secreto cargado: ${secret ? 'SÍ (longitud: ' + secret.length + ')' : 'NO CARGADO'}`);

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          console.log("--- [JwtStrategy] 1. Extrayendo cookie ---");
          const token = request?.cookies?.['jwt'];
          
          if (!token) {
            console.log("[JwtStrategy] ¡ALERTA! La cookie 'jwt' es undefined o null.");
          } else {
            console.log(`[JwtStrategy] Token encontrado. Longitud: ${token.length}. Inicio: ${token.substring(0, 10)}...`);
          }
          return token;
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log("--- [JwtStrategy] 2. Validación iniciada ---");
    
    // Debug del payload recibido tras la decodificación de Passport
    if (!payload) {
      console.log("[JwtStrategy] ERROR: El token fue recibido pero la decodificación devolvió null/undefined.");
      throw new UnauthorizedException("Token inválido o corrupto");
    }

    console.log("[JwtStrategy] 3. Payload decodificado correctamente:", JSON.stringify(payload));
    
    // Verificación de campos obligatorios
    if (!payload.sub) {
      console.log("[JwtStrategy] ERROR: El payload no contiene 'sub' (userId).");
      throw new UnauthorizedException("El token no contiene un ID de usuario válido");
    }

    console.log(`[JwtStrategy] 4. Mapeando usuario: ID=${payload.sub}, Email=${payload.email}`);
    
    return { 
      userId: Number(payload.sub), 
      email: payload.email, 
      role: payload.role 
    };
  }
}