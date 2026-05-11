/**
 * Defines the shape of a stored interaction record.
 *
 * PRIVACY NOTE: Only metadata is persisted.
 * Passwords, tokens, cookies, and session data are NEVER included.
 */

export type InteractionType = 'click' | 'submit';

export interface Interaction {
  email: string;
  interactionType: InteractionType;
  timestamp: string;
  ip: string;
  userAgent: string;
}

export interface InteractionStats {
  totalInteractions: number;
  totalSubmits: number;
  totalClicks: number;
}
