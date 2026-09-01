import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  logout(res: Response) {
    // ¡IMPORTANTE! Deben incluirse las mismas opciones con las que se creó la cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    return { message: 'Sesión Cerrada', status: 'success' };
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
    return user;
  }

  async login(email: string, pass: string, res: Response) {
    console.log("--- Intento de Login ---");
    
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log("Error: Usuario no encontrado");
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      console.log("Error: Contraseña incorrecta");
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    res.cookie('jwt', token, {
      httpOnly: true,       
      secure: true,         
      sameSite: 'none',     
      path: '/',
      maxAge: 2 * 60 * 60 * 1000 
    });

    return { 
      state: 'success', 
      message: 'Login exitoso',
      user: { email: user.email, role: user.role } 
    };
  }
}