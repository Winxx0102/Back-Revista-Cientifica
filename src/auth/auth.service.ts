import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  logout(res: any) {
    res.clearCookie('jwt')
    return { message: 'Sesión Cerrada', status: 'success' }

  }

  private async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    // If password matches, return the user (omit sensitive fields if needed)
    return user;
  }
async login(email: string, pass: string, res: Response) {
  console.log("--- Intento de Login ---");
  
  // 1. Buscar usuario (Se mantiene findUnique si email es @unique en schema.prisma)
  const user = await this.prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log("Error: Usuario no encontrado");
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  // 2. Verificar contraseña
  const isMatch = await bcrypt.compare(pass, user.password);
  if (!isMatch) {
    console.log("Error: Contraseña incorrecta");
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  // 3. Generar el JWT
  const payload = { sub: user.id, email: user.email, role: user.role };
  const token = this.jwtService.sign(payload);

  // 4. Configurar la cookie
  res.cookie('jwt', token, {
    httpOnly: true,       // Protege contra XSS
    secure: true,         // Requerido al usar sameSite: 'none'
    sameSite: 'none',     // Permite el envío cross-site (Render <-> Vercel)
    path: '/',
    maxAge: 2 * 60 * 60 * 1000 // 2 horas en milisegundos
  });

  return { 
    state: 'success', 
    message: 'Login exitoso',
    user: { email: user.email, role: user.role } // Opcional: información pública
  };
}
}