import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
 app.enableCors({
    // Define explícitamente tu dominio, NO uses 'true'
    origin: [true], // Incluye tu localhost para desarrollo
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Esto es vital
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With', 
    exposedHeaders: ['set-cookie'], // Opcional, pero ayuda a veces
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Render asigna un puerto mediante la variable de entorno PORT
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
}

bootstrap();