import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ChroniclesModule } from '@/chronicles/chronicles.module';

@Module({
  imports: [PrismaModule, ChroniclesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Indispensable para que AuthModule lo vea
})
export class UsersModule {}