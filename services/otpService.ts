
import { OtpPurpose, OtpChannel, LogStatus, AuditLogEntry, VerificationSession, RateLimitState } from '../types';
import { DEFAULT_CONFIG } from '../constants';

class OtpService {
  private sessions: Map<string, VerificationSession> = new Map();
  private auditLogs: AuditLogEntry[] = [];
  private rateLimits: Map<string, RateLimitState> = new Map();
  private blocks: Map<string, number> = new Map();

  // Simulation: we just return the OTP for the demo UI to "see"
  // In real production, this is NEVER returned to the client.
  async requestOtp(identifier: string, purpose: OtpPurpose, channel: OtpChannel): Promise<{ tokenId: string; expiresAt: number; debugOtp: string }> {
    // 1. Check Blocks
    const unblockTime = this.blocks.get(identifier);
    if (unblockTime && unblockTime > Date.now()) {
      this.log(identifier, purpose, channel, LogStatus.BLOCKED, `Blocked until ${new Date(unblockTime).toISOString()}`);
      throw new Error(`User is temporarily blocked. Try again in ${Math.ceil((unblockTime - Date.now()) / 60000)} minutes.`);
    }

    // 2. Global Rate Limiting
    const rateLimit = this.rateLimits.get(identifier) || { count: 0, resetAt: Date.now() + 3600000 };
    if (rateLimit.count >= DEFAULT_CONFIG.RATE_LIMIT_IDENTIFIER_PER_HOUR && rateLimit.resetAt > Date.now()) {
      throw new Error("Rate limit exceeded for this identifier. Max 10 requests per hour.");
    }
    this.rateLimits.set(identifier, { count: rateLimit.count + 1, resetAt: rateLimit.resetAt });

    // 3. Generate Token and OTP
    const tokenId = crypto.randomUUID();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = crypto.randomUUID();
    
    // 4. Hashing simulation (Web Crypto API or simple hex string for demo)
    const hashedOtp = await this.hash(otp, salt);
    const expiresAt = Date.now() + (DEFAULT_CONFIG.EXPIRY_MINUTES * 60 * 1000);

    const session: VerificationSession = {
      tokenId,
      hashedOtp,
      salt,
      expiresAt,
      attempts: 0,
      purpose,
      identifier,
      channel
    };

    this.sessions.set(tokenId, session);
    this.log(identifier, purpose, channel, LogStatus.SENT);

    return { tokenId, expiresAt, debugOtp: otp };
  }

  async verifyOtp(tokenId: string, otp: string): Promise<boolean> {
    const session = this.sessions.get(tokenId);
    
    if (!session) {
      throw new Error("Invalid or missing session token.");
    }

    if (Date.now() > session.expiresAt) {
      this.log(session.identifier, session.purpose, session.channel, LogStatus.EXPIRED);
      this.sessions.delete(tokenId);
      throw new Error("OTP has expired.");
    }

    session.attempts += 1;
    const currentHash = await this.hash(otp, session.salt);

    if (currentHash === session.hashedOtp) {
      this.log(session.identifier, session.purpose, session.channel, LogStatus.VERIFIED);
      this.sessions.delete(tokenId);
      return true;
    }

    // Handle failure and blocking
    if (session.attempts >= DEFAULT_CONFIG.MAX_ATTEMPTS) {
      const blockTime = Date.now() + (30 * 60 * 1000); // 30 min hard block
      this.blocks.set(session.identifier, blockTime);
      this.log(session.identifier, session.purpose, session.channel, LogStatus.BLOCKED, "Max attempts reached.");
      this.sessions.delete(tokenId);
      throw new Error("Maximum attempts exceeded. Account blocked for 30 minutes.");
    }

    this.log(session.identifier, session.purpose, session.channel, LogStatus.FAILED, `Attempt ${session.attempts}/${DEFAULT_CONFIG.MAX_ATTEMPTS}`);
    return false;
  }

  private async hash(text: string, salt: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(text + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private log(identifier: string, purpose: OtpPurpose, channel: OtpChannel, status: LogStatus, metadata?: string) {
    this.auditLogs.unshift({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      identifier,
      purpose,
      channel,
      status,
      metadata
    });
    // Keep max 500 logs for demo
    if (this.auditLogs.length > 500) this.auditLogs.pop();
  }

  getLogs() { return [...this.auditLogs]; }
  
  getStats() {
    const totalSent = this.auditLogs.filter(l => l.status === LogStatus.SENT).length;
    const totalVerified = this.auditLogs.filter(l => l.status === LogStatus.VERIFIED).length;
    const totalFailed = this.auditLogs.filter(l => l.status === LogStatus.FAILED).length;
    const totalBlocked = this.auditLogs.filter(l => l.status === LogStatus.BLOCKED).length;
    
    return {
      totalSent,
      totalVerified,
      totalFailed,
      totalBlocked,
      successRate: totalSent > 0 ? (totalVerified / totalSent) * 100 : 0
    };
  }
}

export const otpService = new OtpService();
