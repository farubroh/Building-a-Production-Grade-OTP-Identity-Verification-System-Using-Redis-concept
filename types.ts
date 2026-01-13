
export enum OtpPurpose {
  REGISTRATION = 'REGISTRATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  LOGIN_2FA = 'LOGIN_2FA',
  CHANGE_EMAIL = 'CHANGE_EMAIL',
  CHANGE_MOBILE = 'CHANGE_MOBILE'
}

export enum OtpChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP'
}

export enum LogStatus {
  SENT = 'OTP_SENT',
  VERIFIED = 'OTP_VERIFIED',
  FAILED = 'OTP_FAILED',
  BLOCKED = 'OTP_BLOCKED',
  EXPIRED = 'OTP_EXPIRED'
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  identifier: string;
  purpose: OtpPurpose;
  channel: OtpChannel;
  status: LogStatus;
  metadata?: string;
}

export interface VerificationSession {
  tokenId: string;
  hashedOtp: string;
  salt: string;
  expiresAt: number;
  attempts: number;
  purpose: OtpPurpose;
  identifier: string;
  channel: OtpChannel;
}

export interface SystemStats {
  totalSent: number;
  totalVerified: number;
  totalFailed: number;
  totalBlocked: number;
  successRate: number;
}

export interface RateLimitState {
  count: number;
  resetAt: number;
}
