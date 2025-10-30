import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  dotenv.config({ override: true });

  // Validate Kafka environment variables
  if (!process.env.KAFKA_BROKER_URL || !process.env.KAFKA_CLIENT_ID || !process.env.KAFKA_CONSUMER_GROUP_ID) {
    throw new Error('Missing required Kafka environment variables');
  }

  // Create Kafka microservice
  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER_URL],
        clientId: process.env.KAFKA_CLIENT_ID,
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
      },
    },
  });


  const app = await NestFactory.create(AppModule);
  
  // Configure CORS
  app.enableCors({
    origin: ["*",'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Serve uploaded files if needed
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await Promise.all([
    app.listen(3000),
    kafkaApp.listen(),
  ]);
  console.log(`🚀 HTTP Server running on http://localhost:3000`);
  console.log(`🚀 Kafka microservice is running`);
}
bootstrap();
