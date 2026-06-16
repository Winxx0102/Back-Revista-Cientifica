import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // No pases el datasource manualmente si ya tienes DATABASE_URL en el .env
    // Prisma toma la variable automáticamente por defecto.
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      // Si falla, es vital que leamos por qué en el log
      console.error('❌ Error fatal de Prisma:', error);
      throw error; // Lanzar el error ayuda a Nest a entender que el módulo falló
    }
  }
}