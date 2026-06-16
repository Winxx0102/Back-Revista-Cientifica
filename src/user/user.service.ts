import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client'; // Importamos el enum real de Prisma

function getPagination(query: any) {
  const take = query.take !== undefined ? Number(query.take) : 10;
  const page = query.page !== undefined ? Number(query.page) : 1;
  const skip = query.skip !== undefined ? Number(query.skip) : (page - 1) * take;
  return { take, page, skip };
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findAll(query: any) {
  const search = query.search || ''
  const where: any = {}
  const { take, page, skip } = getPagination(query)

  if (query.search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } }
    ]
  }

  // Agregamos el include para las crónicas
  const data = await this.prisma.user.findMany({ 
    where, 
    take, 
    skip,
    include: {
      _count: {
        select: { chronicles: true }
      }
    }
  })
  
  const totalPages = await this.prisma.user.count({ where })

  return { data, totalPages }
}

  async blockUser(id: number) {
    const user = await this.prisma.user.update({ where: { id }, data: { isBlocked: true } })
    return { status: 'success', message: 'Usuario Bloqueado' }
  }
  async unBlockUser(id: number) {
    const user = await this.prisma.user.update({ where: { id }, data: { isBlocked: false } })
    return { status: 'success', message: 'Usuario Desbloqueado' }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: name }
        ]
      }

    });

    if (existingUser) {
      throw new ConflictException('Las credenciales están registradas');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }


  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }


  async updateRole(id: number, newRole: Role) { // Cambiamos 'any' por 'Role'
    try {
      return await this.prisma.user.update({
        where: { id },
        data: { role: newRole },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`No se encontró el usuario con ID ${id}`);
    }
  }

  async getUserRole(id: number) {
    const role = await this.prisma.user.findUnique({ where: { id } })
    return { role: role.role }

  }


  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
          chronicles: true,
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Eliminamos la contraseña del objeto antes de retornar por si acaso
    const { password, ...result } = user;
    return result;
  }
  async countTotal(): Promise<number> {
  return await this.prisma.user.count();
}

async countBlocked(): Promise<number> {
  return await this.prisma.user.count({
    where: { isBlocked: true }
  });
}

// Alternative listing with counts to avoid duplicate method name

} 