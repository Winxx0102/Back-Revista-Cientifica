import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- ESTO ES LO QUE HACE QUE SEA GLOBAL
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}