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
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { Interaction, InteractionStats } from './interfaces/interaction.interface';

@ApiTags('interactions')
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
  @ApiOperation({
    summary: 'Register interaction',
    description:
      'Registers a simulated click or submit event. Passwords and extra fields are rejected by validation.',
  })
  @ApiBody({ type: CreateInteractionDto })
  @ApiResponse({
    status: 201,
    description: 'Interaction registered successfully.',
    schema: {
      example: {
        message: 'Interaction registered successfully',
        redirectUrl: '/awareness',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload, unknown fields, or unsupported interactionType.',
  })
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
  @ApiOperation({
    summary: 'Get interaction stats',
    description: 'Returns aggregate counts for registered lab interactions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Aggregate interaction statistics.',
    schema: {
      example: {
        totalInteractions: 12,
        totalSubmits: 6,
        totalClicks: 6,
      },
    },
  })
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
  @ApiOperation({
    summary: 'Get interaction logs',
    description:
      'Returns stored interaction metadata for internal lab review. This endpoint should not be public without access control.',
  })
  @ApiResponse({
    status: 200,
    description: 'Stored interaction records.',
    schema: {
      example: [
        {
          email: 'estudiante@uniandes.edu.co',
          interactionType: 'submit',
          timestamp: '2026-05-18T00:00:00.000Z',
          ip: '127.0.0.1',
          userAgent: 'Mozilla/5.0',
        },
      ],
    },
  })
  getLogs(): Interaction[] {
    this.logger.log('GET /interactions/logs');
    return this.interactionsService.getLogs();
  }
}
