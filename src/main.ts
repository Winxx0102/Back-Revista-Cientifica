import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Mantenemos tus configuraciones actuales
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'", 
          "https://revista-cientifica-by-winxx0102.onrender.com", 
          "https://citlayiapryuepjhdofv.supabase.co"
        ],
        // AGREGAMOS ESTA LÍNEA CRÍTICA PARA EL PDF:
        frameSrc: ["'self'", "https://citlayiapryuepjhdofv.supabase.co"],
      },
    },
  }),
);
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

// Truco para evitar que Render duerma el servidor por inactividad
const appUrl = process.env.RENDER_EXTERNAL_URL || 'https://revista-cientifica-by-winxx0102.onrender.com/';

setInterval(async () => {
  try {
    await fetch(appUrl);
    console.log('Ping de actividad enviado para mantener activo el servidor');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error en el auto-ping:', error.message);
    } else {
      console.error('Error en el auto-ping:', error);
    }
  }
}, 10 * 60 * 1000); // Cada 10 minutos

bootstrap();