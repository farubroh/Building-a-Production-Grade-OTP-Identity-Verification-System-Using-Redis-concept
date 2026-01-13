
import React from 'react';
import { OtpPurpose, OtpChannel } from './types';

export const PURPOSE_LABELS: Record<OtpPurpose, { label: string; color: string }> = {
  [OtpPurpose.REGISTRATION]: { label: 'User Registration', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  [OtpPurpose.PASSWORD_RESET]: { label: 'Password Reset', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  [OtpPurpose.LOGIN_2FA]: { label: 'Login 2FA', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  [OtpPurpose.CHANGE_EMAIL]: { label: 'Change Email', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  [OtpPurpose.CHANGE_MOBILE]: { label: 'Change Mobile', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

export const CHANNEL_ICONS: Record<OtpChannel, React.ReactNode> = {
  [OtpChannel.EMAIL]: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  [OtpChannel.SMS]: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  [OtpChannel.WHATSAPP]: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  ),
};

export const DEFAULT_CONFIG = {
  MAX_ATTEMPTS: 5,
  EXPIRY_MINUTES: 5,
  RESEND_COOLDOWN_SECONDS: 60,
  MAX_RESENDS: 3,
  RATE_LIMIT_IDENTIFIER_PER_HOUR: 10,
};
