import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Serve uploaded files if needed
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000);
  console.log(`🚀 Server running on http://localhost:3000`);
}
bootstrap();
