import { Module } from '@nestjs/common';
import { ChroniclesService } from './chronicles.service';
import { ChroniclesController } from './chronicles.controller';

@Module({
  controllers: [ChroniclesController],
  providers: [ChroniclesService],
  exports: [ChroniclesService], // Exportamos el servicio para que pueda ser inyectado en otros módulos
})
export class ChroniclesModule {}
