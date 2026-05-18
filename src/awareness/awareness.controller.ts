/**
 * Awareness Controller
 *
 * Serves the educational content shown to users after they interact
 * with the simulated phishing page. This is the core pedagogical output
 * of the lab exercise.
 */

import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

interface AwarenessResponse {
  title: string;
  message: string;
  recommendations: string[];
}

@ApiTags('awareness')
@Controller('awareness')
export class AwarenessController {
  private readonly logger = new Logger(AwarenessController.name);

  /**
   * GET /api/awareness
   *
   * Returns educational content explaining the simulation and best practices.
   * This endpoint is the destination users are redirected to after interacting
   * with the simulated phishing page.
   */
  @Get()
  @ApiOperation({
    summary: 'Get awareness content',
    description:
      'Returns educational content and recommendations after the simulated phishing interaction.',
  })
  @ApiResponse({
    status: 200,
    description: 'Educational phishing awareness content.',
    schema: {
      example: {
        title: 'Phishing Awareness',
        message:
          'This was a simulated awareness campaign. You have just interacted with a controlled phishing simulation designed for educational purposes within a secure lab environment. No real data was captured or stored.',
        recommendations: [
          'Verify URLs carefully before entering any credentials',
          'Do not share passwords via email or web forms',
          'Report suspicious emails to your IT/security team immediately',
        ],
      },
    },
  })
  getAwarenessContent(): AwarenessResponse {
    this.logger.log('GET /awareness - Serving educational content');

    return {
      title: 'Phishing Awareness',
      message:
        'This was a simulated awareness campaign. ' +
        'You have just interacted with a controlled phishing simulation designed ' +
        'for educational purposes within a secure lab environment. ' +
        'No real data was captured or stored.',
      recommendations: [
        'Verify URLs carefully before entering any credentials',
        'Do not share passwords via email or web forms',
        'Report suspicious emails to your IT/security team immediately',
        'Enable multi-factor authentication (MFA) on all critical accounts',
        'Check for HTTPS and a valid certificate before logging in',
        'Be wary of urgent or threatening language in messages asking for credentials',
        'Hover over links before clicking to inspect the real destination URL',
      ],
    };
  }
}
