/**
 * Rewards Page
 * Mulika Ufisadi - Corruption Reporting Platform
 * Reward claiming interface with tiers, FAQ, and claim tracking
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RewardClaim } from '../components/rewards/RewardClaim';

type TabType = 'claim' | 'tiers' | 'faq' | 'track';

export function Rewards() {
  const [activeTab, setActiveTab] = useState<TabType>('claim');

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Reward Program
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            We reward verified corruption reports that lead to successful investigations. Your
            courage to expose corruption deserves recognition.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'claim' as TabType, label: 'Claim Reward', icon: '🎁' },
            { id: 'tiers' as TabType, label: 'Reward Tiers', icon: '🏆' },
            { id: 'faq' as TabType, label: 'FAQ', icon: '❓' },
            { id: 'track' as TabType, label: 'Track Status', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={activeTab} {...fadeIn}>
          {/* Claim Reward Tab */}
          {activeTab === 'claim' && (
            <div>
              <RewardClaim />
            </div>
          )}

          {/* Reward Tiers Tab */}
          {activeTab === 'tiers' && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  How Rewards Are Calculated
                </h2>
                <p className="text-neutral-600 mb-6">
                  Rewards are based on the verification score of your report, which takes into
                  account evidence quality, impact, and successful prosecution. All reports are
                  thoroughly verified before rewards are issued.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    tier: 'Bronze',
                    amount: 5000,
                    color: 'from-amber-600 to-amber-800',
                    bgColor: 'bg-amber-50',
                    borderColor: 'border-amber-200',
                    textColor: 'text-amber-900',
                    description: 'Basic verified reports',
                    criteria: [
                      'Report verified',
                      'Basic evidence provided',
                      'Case opened',
                    ],
                  },
                  {
                    tier: 'Silver',
                    amount: 15000,
                    color: 'from-gray-400 to-gray-600',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-300',
                    textColor: 'text-gray-900',
                    description: 'Strong evidence & investigation',
                    criteria: [
                      'Multiple evidence types',
                      'Under investigation',
                      'Corroborated by others',
                    ],
                  },
                  {
                    tier: 'Gold',
                    amount: 50000,
                    color: 'from-yellow-400 to-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-300',
                    textColor: 'text-yellow-900',
                    description: 'High-impact cases',
                    criteria: [
                      'Comprehensive evidence',
                      'Charges filed',
                      'Significant public impact',
                    ],
                  },
                  {
                    tier: 'Platinum',
                    amount: 150000,
                    color: 'from-purple-500 to-purple-700',
                    bgColor: 'bg-purple-50',
                    borderColor: 'border-purple-300',
                    textColor: 'text-purple-900',
                    description: 'Major corruption exposed',
                    criteria: [
                      'Exceptional evidence',
                      'Successful conviction',
                      'Major recovery of funds',
                    ],
                  },
                ].map((tier) => (
                  <motion.div
                    key={tier.tier}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`${tier.bgColor} rounded-xl p-6 border-2 ${tier.borderColor} shadow-sm transition-shadow hover:shadow-lg`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <span className="text-3xl text-white font-bold">
                        {tier.tier === 'Bronze' && '🥉'}
                        {tier.tier === 'Silver' && '🥈'}
                        {tier.tier === 'Gold' && '🥇'}
                        {tier.tier === 'Platinum' && '💎'}
                      </span>
                    </div>

                    <h3 className={`text-xl font-bold ${tier.textColor} text-center mb-2`}>
                      {tier.tier}
                    </h3>

                    <p className="text-3xl font-bold text-center mb-4 text-neutral-900 font-secondary">
                      KES {tier.amount.toLocaleString()}
                    </p>

                    <p className="text-sm text-neutral-600 text-center mb-4">
                      {tier.description}
                    </p>

                    <div className="space-y-2">
                      {tier.criteria.map((criterion, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <svg
                            className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
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
                          <span className="text-sm text-neutral-700">{criterion}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-200">
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  Important Note
                </h3>
                <p className="text-sm text-primary-800">
                  Rewards are issued only after thorough verification and in partnership with the
                  Ethics and Anti-Corruption Commission (EACC). The process may take 30-90 days
                  depending on case complexity. All reporters remain anonymous throughout the
                  process.
                </p>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      question: 'How do I know if I qualify for a reward?',
                      answer:
                        'You qualify if your report has been verified, contains credible evidence, and contributes to an active investigation or prosecution. You will receive a notification when your report is verified and a reward is assigned.',
                    },
                    {
                      question: 'How long does it take to receive my reward?',
                      answer:
                        'After successful verification, rewards are typically processed within 24-48 hours via M-Pesa. The verification process itself can take 30-90 days depending on the complexity of the case.',
                    },
                    {
                      question: 'Will claiming a reward reveal my identity?',
                      answer:
                        'No. Our system is designed to maintain complete anonymity. Your M-Pesa number is encrypted and only used for payment. EACC receives only anonymized case data.',
                    },
                    {
                      question: 'What if I lost my tracking token?',
                      answer:
                        'If you lose your tracking token, you can still claim your reward using the encrypted key provided when you submitted your report. Contact our support team for assistance with recovery.',
                    },
                    {
                      question: 'Can I claim multiple rewards?',
                      answer:
                        'Yes! Each verified report is eligible for its own reward. You can submit multiple reports and claim rewards for each one separately using their unique tracking tokens.',
                    },
                    {
                      question: 'What happens if I fail verification?',
                      answer:
                        'You have 3 attempts per verification question. If you exceed the maximum attempts, you can contact support to reset your verification after identity confirmation through alternative means.',
                    },
                    {
                      question: 'Are rewards taxable?',
                      answer:
                        'Rewards under KES 10,000 are not subject to withholding tax. Larger rewards may be subject to taxation as per Kenyan tax law. We recommend consulting with a tax professional for rewards above KES 50,000.',
                    },
                    {
                      question: 'What if my report does not lead to prosecution?',
                      answer:
                        'You may still qualify for a Bronze or Silver tier reward if your report is verified and contributes valuable intelligence, even if it doesn\'t lead to immediate prosecution.',
                    },
                    {
                      question: 'How is the reward tier determined?',
                      answer:
                        'Reward tiers are determined by an automated scoring system that evaluates evidence quality, corroboration, impact assessment, and case outcomes. This ensures fair and objective reward allocation.',
                    },
                    {
                      question: 'Can I donate my reward to charity?',
                      answer:
                        'Yes! During the claim process, you can choose to donate all or part of your reward to registered anti-corruption NGOs. We will provide a list of partner organizations.',
                    },
                  ].map((faq, index) => (
                    <div
                      key={index}
                      className="pb-6 border-b border-neutral-200 last:border-b-0"
                    >
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2 flex items-start gap-3">
                        <span className="text-primary-500 flex-shrink-0">Q:</span>
                        <span>{faq.question}</span>
                      </h3>
                      <p className="text-neutral-600 ml-8">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-secondary-50 rounded-xl p-6 border border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Still Have Questions?
                </h3>
                <p className="text-sm text-secondary-800 mb-4">
                  Contact our support team via encrypted channels for additional assistance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:rewards@mulikaufisadi.org"
                    className="text-sm font-medium text-secondary-700 hover:text-secondary-900 underline"
                  >
                    Email Support
                  </a>
                  <a
                    href="https://telegram.me/mulikaufisadi"
                    className="text-sm font-medium text-secondary-700 hover:text-secondary-900 underline"
                  >
                    Telegram
                  </a>
                  <a
                    href="https://signal.org/mulikaufisadi"
                    className="text-sm font-medium text-secondary-700 hover:text-secondary-900 underline"
                  >
                    Signal
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Track Status Tab */}
          {activeTab === 'track' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Track Your Claim Status
                </h2>

                <p className="text-neutral-600 mb-8">
                  Enter your tracking token to check the status of your reward claim.
                </p>

                <div className="space-y-6">
                  <input
                    type="text"
                    placeholder="MLK-2025-XXXXX"
                    className="w-full rounded-lg px-4 py-3 border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 font-secondary text-lg transition-all duration-200"
                  />

                  <button
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
                    onClick={() => alert('Track status feature coming soon!')}
                  >
                    Check Status
                  </button>
                </div>

                <div className="mt-8 p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Claim Status Guide
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        status: 'Pending',
                        color: 'bg-yellow-100 text-yellow-800',
                        description:
                          'Your report is under review. Verification in progress.',
                      },
                      {
                        status: 'Eligible',
                        color: 'bg-blue-100 text-blue-800',
                        description:
                          'Your report has been verified. You can now claim your reward.',
                      },
                      {
                        status: 'Claimed',
                        color: 'bg-purple-100 text-purple-800',
                        description:
                          'Reward claim submitted. Payment processing underway.',
                      },
                      {
                        status: 'Paid',
                        color: 'bg-green-100 text-green-800',
                        description:
                          'Reward successfully paid via M-Pesa. Check your phone for confirmation.',
                      },
                    ].map((item) => (
                      <div
                        key={item.status}
                        className="flex items-start gap-4 p-4 bg-white rounded-lg border border-neutral-200"
                      >
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}
                        >
                          {item.status}
                        </span>
                        <p className="text-sm text-neutral-600 flex-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary-50 rounded-lg border border-primary-200">
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-primary-800">
                    If you provided a contact method when submitting your report, you will receive
                    SMS updates at each stage of the reward process. All messages are encrypted and
                    contain no identifying information about your report.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Haven't Reported Yet?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Your voice matters. Report corruption anonymously and help build a transparent Kenya.
            Verified reports are eligible for rewards.
          </p>
          <a
            href="/report"
            className="inline-block bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg hover:bg-neutral-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Submit a Report
          </a>
        </div>
      </div>
    </div>
  );
}
