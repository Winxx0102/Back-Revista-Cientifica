import { Controller, Post, Body, HttpCode, HttpStatus, Res, Get, UseGuards, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') // Para organizar en Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Iniciar sesión y retornar token' })
async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
  // Ahora solo llamamos al servicio y esperamos el token (string)
  // authService.login expects three arguments in its current signature.
  // Provide undefined for the optional parameters to match the expected arity.
  const token = await this.authService.login(loginDto.email, loginDto.password, res);

  // Retornamos el objeto JSON directamente
  return {
    access_token: token,
    message: 'Login exitoso'
  };
}

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cerrar sesión y limpiar cookie' })
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res);
  }

  

  @Get('verify-session')
@UseGuards(JwtAuthGuard)
verifySession(@Req() req: any) {
  return { user: req.user }; // Devuelve el usuario decodificado del JWT
}
}