/**
 * Interactions Controller
 *
 * Exposes REST endpoints for the phishing awareness simulation lab.
 *
 * EDUCATIONAL USE ONLY:
 * - All endpoints are designed exclusively for controlled academic environments.
 * - No passwords or sensitive credentials are processed or stored.
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { Interaction, InteractionStats } from './interfaces/interaction.interface';

@Controller('interactions')
export class InteractionsController {
  private readonly logger = new Logger(InteractionsController.name);

  constructor(private readonly interactionsService: InteractionsService) {}

  /**
   * POST /api/interactions
   *
   * Registers a simulated interaction (click or submit) from the phishing page.
   * Captures only pedagogical metadata — never any credential data.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  register(
    @Body() dto: CreateInteractionDto,
    @Req() req: Request,
  ): { message: string; redirectUrl: string } {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    const userAgent = req.headers['user-agent'] || 'unknown';

    this.logger.log(
      `POST /interactions | type=${dto.interactionType} | ip=${ip}`,
    );

    return this.interactionsService.register(dto, ip, userAgent);
  }

  /**
   * GET /api/interactions/stats
   *
   * Returns aggregate counts for lab reporting and analysis.
   */
  @Get('stats')
  getStats(): InteractionStats {
    this.logger.log('GET /interactions/stats');
    return this.interactionsService.getStats();
  }

  /**
   * GET /api/interactions/logs
   *
   * Returns all stored interaction records.
   * Only pedagogical metadata fields are present — no sensitive data exists.
   */
  @Get('logs')
  getLogs(): Interaction[] {
    this.logger.log('GET /interactions/logs');
    return this.interactionsService.getLogs();
  }
}
