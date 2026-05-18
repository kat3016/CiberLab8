/**
 * Root API Controller
 *
 * Provides a simple health response and machine-readable endpoint
 * documentation for the academic phishing awareness lab backend.
 */

import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

interface ApiStatusResponse {
  status: 'ok';
  name: string;
  version: string;
  message: string;
  docs: string;
  timestamp: string;
}

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: 'API status',
    description: 'Returns a simple OK response to confirm the backend is running.',
  })
  @ApiResponse({
    status: 200,
    description: 'The API is running.',
    schema: {
      example: {
        status: 'ok',
        name: 'Phishing Awareness Simulation Lab API',
        version: '1.0.0',
        message: 'API running',
        docs: '/api/docs',
        timestamp: '2026-05-18T00:00:00.000Z',
      },
    },
  })
  getStatus(): ApiStatusResponse {
    return {
      status: 'ok',
      name: 'Phishing Awareness Simulation Lab API',
      version: '1.0.0',
      message: 'API running',
      docs: '/api/docs',
      timestamp: new Date().toISOString(),
    };
  }
}
