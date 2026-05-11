/**
 * DTO for incoming interaction registration requests.
 *
 * Only email and interactionType are accepted from the client.
 * All other metadata (timestamp, IP, user-agent) is captured server-side.
 * Passwords and credentials are EXPLICITLY excluded and must never be added.
 */

import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateInteractionDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'interactionType is required' })
  @IsString()
  @IsIn(['click', 'submit'], {
    message: 'interactionType must be either "click" or "submit"',
  })
  interactionType: 'click' | 'submit';

  // NOTE: Do NOT add a "password" field here.
  // This system is designed to register awareness metrics only.
}
