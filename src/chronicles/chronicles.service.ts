// import { Injectable } from '@nestjs/common';
// import { CreateChronicleDto } from './dto/create-chronicle.dto';
// import { UpdateChronicleDto } from './dto/update-chronicle.dto';
// import { PrismaService } from '../../prisma/prisma.service';
// @Injectable()
// export class ChroniclesService {
//   constructor(private prisma: PrismaService) {}

// async create(createChronicleDto: CreateChronicleDto, userId: number) {
 
//   return this.prisma.chronicles.create({
//     data: {
//       ...createChronicleDto,
//       userId,
//     },
//   });
// }

//   findAll() {
//     return this.prisma.chronicles.findMany();
//   }

//   findOne(id: number) {
//     return this.prisma.chronicles.findUnique({
//       where: { id },
//     });
//   }

//   update(id: number, updateChronicleDto: UpdateChronicleDto) {
//     return this.prisma.chronicles.update({
//       where: { id },
//       data: updateChronicleDto as any,
//     });
//   }

//   remove(id: number) {
//     return this.prisma.chronicles.delete({
//       where: { id },
//     });
//   }
// // chronicles.service.ts
// // chronicles.service.ts
// async findByUser(userId: number) {
//   // Verificamos que sea un número válido antes de hacer la consulta
//   if (typeof userId !== 'number' || isNaN(userId)) {
//     throw new Error("El ID proporcionado debe ser un número válido");
//   }

//   return this.prisma.chronicles.findMany({
//     where: {
//       userId: userId, // Prisma ahora recibirá un number garantizado
//     },
//     orderBy: {
//       createdAt: 'desc',
//     },
//   });
// }
// async countTotal(): Promise<number> {
//   return await this.prisma.chronicles.count();
// }

// }

import { Injectable } from '@nestjs/common';
import { CreateChronicleDto } from './dto/create-chronicle.dto';
import { UpdateChronicleDto } from './dto/update-chronicle.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChroniclesService {
  constructor(private prisma: PrismaService) {}

  async create(createChronicleDto: CreateChronicleDto, userId: number) {
    return this.prisma.chronicles.create({
      data: {
        ...createChronicleDto,
        userId,
        isApproved: false, // Por defecto todo artículo nuevo entra en revisión
      },
    });
  }

  // Solo devuelve artículos que han sido autorizados para la vista general
  findAll() {
    return this.prisma.chronicles.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Devuelve los artículos pendientes para la campana de notificaciones del admin
  findPending() {
    return this.prisma.chronicles.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Cambia el estado de la crónica a aprobado
  approve(id: number) {
    return this.prisma.chronicles.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  findOne(id: number) {
    return this.prisma.chronicles.findUnique({
      where: { id },
    });
  }

  update(id: number, updateChronicleDto: UpdateChronicleDto) {
    return this.prisma.chronicles.update({
      where: { id },
      data: updateChronicleDto as any,
    });
  }

  remove(id: number) {
    return this.prisma.chronicles.delete({
      where: { id },
    });
  }

  async findByUser(userId: number) {
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

  async countTotal(): Promise<number> {
    return await this.prisma.chronicles.count();
  }
}