import { Module } from '@nestjs/common';
import { AwarenessController } from './awareness.controller';

@Module({
  controllers: [AwarenessController],
})
export class AwarenessModule {}
