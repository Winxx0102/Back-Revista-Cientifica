import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { ChroniclesService } from './chronicles.service';
import { CreateChronicleDto } from './dto/create-chronicle.dto';
import { UpdateChronicleDto } from './dto/update-chronicle.dto';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

// Define cómo es tu usuario en el request
interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    // ... otros campos
  };
}

@Controller('chronicles')
export class ChroniclesController {
  constructor(private readonly chroniclesService: ChroniclesService) {}


 
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.USER)// Define el rol requerido para crear una crónica
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createChronicleDto: CreateChronicleDto, @Req() req: any) {
    // 1. Acceder al usuario inyectado por los Guards
    const user = req.user;

console.log("--- DEBUG FINAL ---");
  console.log("¿Existe req.user?:", !!user);
  console.log("Objeto usuario:", user);

    if (!user || user.userId === undefined) {
    throw new UnauthorizedException("El sistema de autenticación no pudo identificar al usuario.");
  }
  if (user.isBlocked) {
    throw new ForbiddenException("Tu cuenta está bloqueada y no puedes crear crónicas.");
  }

    const userId = Number(user.userId);
    console.log("UserID procesado para el servicio:", userId);

    // 4. Llamada al servicio
    return this.chroniclesService.create(createChronicleDto, user.userId || userId);
  }



  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.chroniclesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chroniclesService.findOne(+id);
  }
@Get('my/list')
@UseGuards(JwtAuthGuard)
async getMyChronicles(@Req() req: any) {
  // Accedemos a la propiedad correcta: 'userId'
  const userId = req.user.userId; 
  
  console.log("ID extraído con éxito:", userId);

  // Ya no necesitamos tanto log, esto debería funcionar directo:
  return this.chroniclesService.findByUser(Number(userId));
}

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChronicleDto: UpdateChronicleDto) {
    return this.chroniclesService.update(+id, updateChronicleDto);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chroniclesService.remove(+id);
  }
}
