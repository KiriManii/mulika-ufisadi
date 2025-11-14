/**
 * Reward Claim Component
 * Mulika Ufisadi - Corruption Reporting Platform
 * Main UI for claiming rewards with multi-step flow
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { VerificationForm } from './VerificationForm';
import { generateHash } from '../../lib/encryption';
import { RewardTier, RewardStatus, type RewardToken, type Reward } from '../../types/reward';

type ClaimStep = 'token' | 'verification' | 'mpesa' | 'success' | 'failed';

const tokenSchema = z.object({
  token: z
    .string()
    .min(1, 'Token is required')
    .regex(/^MLK-\d{4}-[A-Z0-9]{5}$/, 'Invalid token format. Expected: MLK-YYYY-XXXXX'),
});

const mpesaSchema = z.object({
  mpesaNumber: z
    .string()
    .min(1, 'M-Pesa number is required')
    .regex(/^(254|0)[17]\d{8}$/, 'Invalid M-Pesa number. Format: 254XXXXXXXXX or 07XXXXXXXX'),
});

type TokenFormData = z.infer<typeof tokenSchema>;
type MpesaFormData = z.infer<typeof mpesaSchema>;

const REWARD_TIERS: Record<RewardTier, number> = {
  [RewardTier.Bronze]: 5000,
  [RewardTier.Silver]: 15000,
  [RewardTier.Gold]: 50000,
  [RewardTier.Platinum]: 150000,
};

export function RewardClaim() {
  const [currentStep, setCurrentStep] = useState<ClaimStep>('token');
  const [rewardToken, setRewardToken] = useState<RewardToken | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerToken,
    handleSubmit: handleSubmitToken,
    formState: { errors: tokenErrors },
  } = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema),
  });

  const {
    register: registerMpesa,
    handleSubmit: handleSubmitMpesa,
    formState: { errors: mpesaErrors },
  } = useForm<MpesaFormData>({
    resolver: zodResolver(mpesaSchema),
  });

  const onTokenSubmit = (data: TokenFormData) => {
    setError(null);

    try {
      // Validate token and retrieve reward data
      // In production, this would be an API call
      const mockRewardToken = validateToken(data.token);

      if (!mockRewardToken) {
        setError('Invalid token or token not found. Please check and try again.');
        return;
      }

      if (mockRewardToken.claimed) {
        setError('This reward has already been claimed.');
        return;
      }

      setRewardToken(mockRewardToken);

      // Get reward tier and amount based on report verification
      const mockReward = getRewardForToken(mockRewardToken);
      setReward(mockReward);

      // Move to verification step
      setCurrentStep('verification');
    } catch (err) {
      setError('An error occurred while validating your token. Please try again.');
      console.error('Token validation error:', err);
    }
  };

  const onVerificationComplete = () => {
    setError(null);
    setCurrentStep('mpesa');
  };

  const onVerificationFailed = () => {
    setError('Verification failed. Maximum attempts exceeded.');
    setCurrentStep('failed');
  };

  const onMpesaSubmit = (data: MpesaFormData) => {
    setError(null);

    try {
      // Submit claim with M-Pesa number
      // In production, this would trigger M-Pesa payment
      if (reward) {
        const updatedReward: Reward = {
          ...reward,
          status: 'claimed' as RewardStatus,
          claimedAt: new Date(),
          mpesaNumber: data.mpesaNumber,
        };
        setReward(updatedReward);
      }

      // Mark token as claimed
      if (rewardToken) {
        const updatedToken: RewardToken = {
          ...rewardToken,
          claimed: true,
        };
        setRewardToken(updatedToken);
      }

      // Move to success step
      setCurrentStep('success');
    } catch (err) {
      setError('An error occurred while processing your claim. Please try again.');
      console.error('M-Pesa submission error:', err);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          {(['token', 'verification', 'mpesa', 'success'] as const).map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === step;
            const isCompleted =
              (['token', 'verification', 'mpesa', 'success', 'failed'] as const).indexOf(currentStep) >
              index;

            return (
              <div key={step} className="contents">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-primary-500 text-white'
                        : isActive
                        ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive ? 'text-primary-700' : 'text-neutral-500'
                    }`}
                  >
                    {step === 'token'
                      ? 'Token'
                      : step === 'verification'
                      ? 'Verify'
                      : step === 'mpesa'
                      ? 'Payment'
                      : 'Complete'}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-1 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-primary-500' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Token Entry */}
        {currentStep === 'token' && (
          <motion.div key="token" {...fadeIn}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Claim Your Reward
                </h2>
                <p className="text-neutral-600">
                  Enter your tracking token to begin the reward claim process
                </p>
              </div>

              <form onSubmit={handleSubmitToken(onTokenSubmit)} className="space-y-6">
                <Input
                  label="Tracking Token"
                  type="text"
                  placeholder="MLK-2025-XXXXX"
                  {...registerToken('token')}
                  error={tokenErrors.token?.message}
                  required
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" fullWidth>
                  Validate Token
                </Button>
              </form>

              <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-700">
                  <strong>Note:</strong> Your tracking token was provided when you submitted your
                  corruption report. If you cannot find it, please check your saved records.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Verification */}
        {currentStep === 'verification' && rewardToken && (
          <motion.div key="verification" {...fadeIn}>
            <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                Identity Verification
              </h2>
              <p className="text-neutral-600">
                Answer the following questions to verify you are the original reporter
              </p>
              {reward && (
                <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                  <p className="text-sm font-medium text-primary-900">
                    Potential Reward: <span className="text-xl">KES {reward.amount.toLocaleString()}</span>
                  </p>
                  <p className="text-xs text-primary-700 mt-1">
                    Tier: {reward.tier.charAt(0).toUpperCase() + reward.tier.slice(1)}
                  </p>
                </div>
              )}
            </div>

            <VerificationForm
              questions={rewardToken.verificationQuestions}
              onVerificationComplete={onVerificationComplete}
              onVerificationFailed={onVerificationFailed}
            />
          </motion.div>
        )}

        {/* Step 3: M-Pesa Number */}
        {currentStep === 'mpesa' && reward && (
          <motion.div key="mpesa" {...fadeIn}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Verification Successful!
                </h2>
                <p className="text-neutral-600">Enter your M-Pesa number to receive your reward</p>
                <div className="mt-4 inline-block px-6 py-3 bg-primary-50 rounded-lg border-2 border-primary-200">
                  <p className="text-sm font-medium text-primary-900">Reward Amount</p>
                  <p className="text-3xl font-bold text-primary-700">
                    KES {reward.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitMpesa(onMpesaSubmit)} className="space-y-6">
                <Input
                  label="M-Pesa Phone Number"
                  type="tel"
                  placeholder="254XXXXXXXXX or 07XXXXXXXX"
                  {...registerMpesa('mpesaNumber')}
                  error={mpesaErrors.mpesaNumber?.message}
                  required
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <Button type="submit" variant="secondary" size="lg" fullWidth>
                  Submit Claim
                </Button>
              </form>

              <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <p className="text-sm text-neutral-700">
                  <strong>Payment Processing:</strong> Your reward will be sent via M-Pesa within
                  24-48 hours after claim verification. You will receive an SMS confirmation.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {currentStep === 'success' && reward && (
          <motion.div key="success" {...fadeIn}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Reward Claim Successful!
              </h2>

              <p className="text-lg text-neutral-600 mb-8">
                Your reward has been processed and will be sent to your M-Pesa shortly.
              </p>

              <div className="bg-primary-50 rounded-lg p-6 mb-8 border border-primary-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Reward Amount</p>
                    <p className="text-2xl font-bold text-primary-700">
                      KES {reward.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">M-Pesa Number</p>
                    <p className="text-lg font-semibold text-neutral-900 font-secondary">
                      {reward.mpesaNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Reward Tier</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {reward.tier.charAt(0).toUpperCase() + reward.tier.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Claim Date</p>
                    <p className="text-lg font-semibold text-neutral-900">
                      {reward.claimedAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                <p className="text-sm text-green-800">
                  <strong>Next Steps:</strong> You will receive an M-Pesa confirmation SMS within
                  24-48 hours. Keep your tracking token for future reference.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => window.location.reload()}
              >
                Make Another Claim
              </Button>
            </div>
          </motion.div>
        )}

        {/* Failed State */}
        {currentStep === 'failed' && (
          <motion.div key="failed" {...fadeIn}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Verification Failed
              </h2>

              <p className="text-lg text-neutral-600 mb-8">
                You have exceeded the maximum number of verification attempts. Please contact
                support for assistance.
              </p>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-sm text-red-800">
                  {error || 'Maximum verification attempts exceeded.'}
                </p>
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.reload()}
              >
                Try Again Later
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mock functions - In production, these would be API calls

function validateToken(token: string): RewardToken | null {
  // Mock validation - In production, this would verify against backend
  if (!token.match(/^MLK-\d{4}-[A-Z0-9]{5}$/)) {
    return null;
  }

  // Mock reward token data
  return {
    id: token,
    reportId: 'report_' + Math.random().toString(36).substring(7),
    encryptionKey: 'mock_encryption_key',
    qrCode: 'mock_qr_code_base64',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    claimed: false,
    verificationQuestions: [
      {
        question: 'What county did you report corruption in?',
        hashedAnswer: generateHash('nairobi'), // Mock answer: "Nairobi"
        attempts: 0,
        maxAttempts: 3,
      },
      {
        question: 'What was the approximate bribe amount (KES)?',
        hashedAnswer: generateHash('5000'), // Mock answer: "5000"
        attempts: 0,
        maxAttempts: 3,
      },
      {
        question: 'Enter the first 3 characters of your report description:',
        hashedAnswer: generateHash('pol'), // Mock answer: "pol"
        attempts: 0,
        maxAttempts: 3,
      },
    ],
  };
}

function getRewardForToken(token: RewardToken): Reward {
  // Mock reward calculation based on report verification score
  // In production, this would be calculated based on actual verification
  const tiers: RewardTier[] = [RewardTier.Bronze, RewardTier.Silver, RewardTier.Gold, RewardTier.Platinum];
  const randomTier = tiers[Math.floor(Math.random() * tiers.length)];

  return {
    tokenId: token.id,
    tier: randomTier,
    amount: REWARD_TIERS[randomTier],
    status: 'eligible' as RewardStatus,
    eligibleFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Eligible for 7 days
  };
}
