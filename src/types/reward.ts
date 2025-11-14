/**
 * Reward Types and Interfaces
 * Mulika Ufisadi - Corruption Reporting Platform
 */

export interface RewardToken {
  id: string; // Format: MLK-2025-XXXXX
  reportId: string;
  encryptionKey: string;
  qrCode: string; // Base64 QR code
  createdAt: Date;
  claimed: boolean;
  verificationQuestions: VerificationQuestion[];
}

export interface VerificationQuestion {
  question: string;
  hashedAnswer: string; // SHA-256
  attempts: number;
  maxAttempts: number;
}

export interface Reward {
  tokenId: string;
  tier: RewardTier;
  amount: number;
  status: RewardStatus;
  eligibleFrom: Date;
  claimedAt?: Date;
  mpesaNumber?: string;
}

export enum RewardTier {
  Bronze = 'bronze', // KES 5,000
  Silver = 'silver', // KES 15,000
  Gold = 'gold', // KES 50,000
  Platinum = 'platinum', // KES 150,000
}

export enum RewardStatus {
  Pending = 'pending',
  Eligible = 'eligible',
  Claimed = 'claimed',
  Paid = 'paid',
}
