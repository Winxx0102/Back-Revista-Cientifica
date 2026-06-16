import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 1. Importa esto
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { ChroniclesModule } from './chronicles/chronicles.module';

@Module({
  imports: [
    
    // 2. Configuración global de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // Esto hace que el ConfigService esté disponible en toda la app
    }),

    PrismaModule, 
    
    ...(process.env.NODE_ENV !== 'production' ? [
      ServeStaticModule.forRoot({
        rootPath: join(process.cwd(), 'public'),
        serveRoot: '/public',
      }),
    ] : []),

    AuthModule,
    UsersModule,
    ChroniclesModule,
  ],
  providers: [],
})
export class AppModule { }