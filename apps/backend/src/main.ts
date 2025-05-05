console.log('DATABASE_URL:', process.env.DATABASE_URL);

import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(['log', 'error', 'warn', 'debug']);

  const cookieSecret: string = process.env.JWT_SECRET || 'secret-example';

  app.use(cookieParser(cookieSecret));

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
