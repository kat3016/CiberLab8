/**
 * Root application module.
 * Composes all feature modules and loads environment configuration.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InteractionsModule } from './interactions/interactions.module';
import { AwarenessModule } from './awareness/awareness.module';

@Module({
  imports: [
    // Load .env variables globally across all modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    InteractionsModule,
    AwarenessModule,
  ],
})
export class AppModule {}
