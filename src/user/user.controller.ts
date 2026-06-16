import { Controller, Post, Body, Patch, Param, ParseIntPipe, UseGuards, Get, Req, Query } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto, Role } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ChroniclesService } from '../chronicles/chronicles.service';

/* PROBANDO COMENTARIO EN LA BRANCH NUEVA */
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly chroniclesService: ChroniclesService, // Inyección
  ) {}



@Get('')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query() query) {
    // Debes pasar el objeto 'query' al servicio para que la paginación y búsqueda funcionen
    return await this.usersService.findAll(query);
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser('userId') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Get('role')
  @UseGuards(JwtAuthGuard)
  async getUserRole(@Req() req) {
    const userId = req.user.userId

    return this.usersService.getUserRole(userId)
  }

  @Patch('block/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  blockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.blockUser(id)
  }

  @Patch('unblock/:id')
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  unBlockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unBlockUser(id)
  }

  @Patch('role/:id')
  @Roles( Role.SUPERADMIN) // Solo superadmin pueden cambiar roles
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: Role,
  ) {
    return this.usersService.updateRole(id, role);
  }


  @Get('admin/stats')
@Roles(Role.ADMIN, Role.SUPERADMIN) // Solo admin y superadmin pueden ver métricas
@UseGuards(JwtAuthGuard, RolesGuard)
async getStats() {
  // Asegúrate de que tus servicios tengan estos métodos
  const totalUsers = await this.usersService.countTotal();
  const blockedUsers = await this.usersService.countBlocked();
  const totalchronicles = await this.chroniclesService.countTotal();

  return {
    totalchronicles,
    totalUsers,
    blockedUsers,
    // Puedes añadir más métricas según tu DB
  };
}
}