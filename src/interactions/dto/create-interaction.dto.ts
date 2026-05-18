/**
 * DTO for incoming interaction registration requests.
 *
 * Only email and interactionType are accepted from the client.
 * All other metadata (timestamp, IP, user-agent) is captured server-side.
 * Passwords and credentials are EXPLICITLY excluded and must never be added.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateInteractionDto {
  @ApiProperty({
    example: 'estudiante@uniandes.edu.co',
    description: 'Email address used only for lab interaction evidence.',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({
    enum: ['click', 'submit'],
    example: 'submit',
    description: 'Type of simulated interaction registered by the frontend.',
  })
  @IsNotEmpty({ message: 'interactionType is required' })
  @IsString()
  @IsIn(['click', 'submit'], {
    message: 'interactionType must be either "click" or "submit"',
  })
  interactionType: 'click' | 'submit';

  // NOTE: Do NOT add a "password" field here.
  // This system is designed to register awareness metrics only.
}
