/**
 * PHISHING AWARENESS LAB - Main Entry Point
 *
 * PURPOSE: Academic cybersecurity lab for pedagogical phishing simulation.
 * This backend registers interaction metadata ONLY for educational evidence.
 *
 * IMPORTANT:
 * - No passwords or credentials are stored at any point.
 * - This system must ONLY be used in controlled, authorized lab environments.
 * - Unauthorized use outside academic/training contexts is strictly prohibited.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Global validation pipe - enforces DTOs on every endpoint
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,        // Auto-transform payloads to DTO instances
    }),
  );

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS - restrict to configured origin in production
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Phishing Awareness Simulation Lab API')
    .setDescription(
      'Academic cybersecurity lab backend for controlled phishing awareness simulations. ' +
        'The API stores lab interaction metadata only and never stores passwords.',
    )
    .setVersion('1.0.0')
    .addTag('health', 'API status and metadata')
    .addTag('awareness', 'Educational awareness content')
    .addTag('interactions', 'Lab interaction registration and reporting')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    customSiteTitle: 'CiberLab8 API Docs',
    swaggerOptions: {
      persistAuthorization: false,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`=========================================`);
  logger.log(`  Phishing Awareness Lab API running`);
  logger.log(`  http://localhost:${port}/api`);
  logger.log(`  Docs: http://localhost:${port}/api/docs`);
  logger.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`  EDUCATIONAL USE ONLY - Controlled Lab`);
  logger.log(`=========================================`);
}

bootstrap();
