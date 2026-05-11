/**
 * Interactions Service
 *
 * Handles the core logic for registering and querying interaction records.
 *
 * EDUCATIONAL USE ONLY:
 * - Persists metadata (email, interaction type, timestamp, IP, user-agent).
 * - Never stores passwords, tokens, cookies, or any authentication credentials.
 * - Designed exclusively for controlled academic lab environments.
 */

import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import {
  Interaction,
  InteractionStats,
} from './interfaces/interaction.interface';

@Injectable()
export class InteractionsService {
  private readonly logger = new Logger(InteractionsService.name);
  private readonly logFilePath: string;

  constructor(private readonly configService: ConfigService) {
    this.logFilePath = path.resolve(
      this.configService.get<string>(
        'INTERACTIONS_LOG_FILE',
        'src/logs/interactions.json',
      ),
    );
    this.ensureLogFile();
  }

  /**
   * Registers a new interaction record from the simulated phishing page.
   * Metadata is captured server-side; no sensitive data is accepted.
   */
  register(
    dto: CreateInteractionDto,
    ip: string,
    userAgent: string,
  ): { message: string; redirectUrl: string } {
    const record: Interaction = {
      email: dto.email,
      interactionType: dto.interactionType,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
    };

    this.appendRecord(record);

    this.logger.log(
      `[LAB] Interaction registered | type=${record.interactionType} | ip=${record.ip}`,
    );

    return {
      message: 'Interaction registered successfully',
      redirectUrl: this.configService.get<string>(
        'AWARENESS_REDIRECT_URL',
        '/awareness',
      ),
    };
  }

  /**
   * Returns aggregated statistics for lab reporting.
   */
  getStats(): InteractionStats {
    const records = this.readRecords();
    return {
      totalInteractions: records.length,
      totalSubmits: records.filter((r) => r.interactionType === 'submit')
        .length,
      totalClicks: records.filter((r) => r.interactionType === 'click').length,
    };
  }

  /**
   * Returns all stored interaction records.
   * Only pedagogical metadata is returned — no sensitive fields exist.
   */
  getLogs(): Interaction[] {
    return this.readRecords();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private ensureLogFile(): void {
    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, JSON.stringify([], null, 2), 'utf-8');
      this.logger.log(`Log file initialised at: ${this.logFilePath}`);
    }
  }

  private readRecords(): Interaction[] {
    try {
      const raw = fs.readFileSync(this.logFilePath, 'utf-8');
      return JSON.parse(raw) as Interaction[];
    } catch {
      throw new InternalServerErrorException('Failed to read interactions log');
    }
  }

  private appendRecord(record: Interaction): void {
    try {
      const records = this.readRecords();
      records.push(record);
      fs.writeFileSync(
        this.logFilePath,
        JSON.stringify(records, null, 2),
        'utf-8',
      );
    } catch {
      throw new InternalServerErrorException(
        'Failed to write interaction record',
      );
    }
  }
}
