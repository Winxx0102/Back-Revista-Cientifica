import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

function getPagination(query: any) {
  const take = query.take !== undefined ? Number(query.take) : 10;
  const page = query.page !== undefined ? Number(query.page) : 1;
  const skip = query.skip !== undefined ? Number(query.skip) : (page - 1) * take;
  return { take, page, skip };
}

@Injectable()
export class UsersService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  constructor(private prisma: PrismaService) { }

  async findAll(query: any) {
    const search = query.search || '';
    const where: any = {};
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

  async blockUser(id: number) {
    await this.prisma.user.update({ where: { id }, data: { isBlocked: true } });
    return { status: 'success', message: 'Usuario Bloqueado' };
  }

  async unBlockUser(id: number) {
    await this.prisma.user.update({ where: { id }, data: { isBlocked: false } });
    return { status: 'success', message: 'Usuario Desbloqueado' };
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { name }] }
    });

    if (existingUser) throw new ConflictException('Las credenciales están registradas');

    // 1. Crear en Supabase Auth
    const { data: authData, error: authError } = await this.supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { role: 'USER' },
      email_confirm: true,
    });

    if (authError) throw new BadRequestException(authError.message);

    // 2. Hashear y guardar en DB local con el vínculo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER",
        supabaseUid: authData.user.id, // Vínculo para el RLS
      },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateRole(id: number, newRole: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    try {
      // 1. Actualizar en Supabase para que el RLS tenga el rol actualizado
      if (user.supabaseUid) {
        await this.supabase.auth.admin.updateUserById(user.supabaseUid, {
          user_metadata: { role: newRole }
        });
      }

      // 2. Actualizar localmente
      return await this.prisma.user.update({
        where: { id },
        data: { role: newRole },
        select: { id: true, email: true, role: true },
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(`Error al actualizar el rol: ${msg}`);
    }
  }

  async getUserRole(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return { role: user.role };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { chronicles: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { password, ...result } = user;
    return result;
  }

  async countTotal(): Promise<number> {
    return await this.prisma.user.count();
  }

  async countBlocked(): Promise<number> {
    return await this.prisma.user.count({ where: { isBlocked: true } });
  }
}