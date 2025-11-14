/**
 * Home Page - Landing Page
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Main landing page with hero section, live statistics, how it works section,
 * CTA section, and partners
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Award,
} from 'lucide-react';
import { HeroSection } from '../components/hero/HeroSection';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SAMPLE_STATS } from '../constants/statistics';

/**
 * Home Page Component
 */
export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Live Statistics Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Real-Time Corruption Statistics
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Track corruption reports across Kenya and see the impact of collective action
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card hoverable className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Total Reports
                </h3>
                <div className="text-4xl font-bold text-primary-500">
                  <AnimatedCounter
                    end={SAMPLE_STATS.totalReports}
                    duration={2000}
                  />
                </div>
                <p className="text-sm text-neutral-500 mt-2">Since 2017</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card hoverable className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-secondary-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Total Amount
                </h3>
                <div className="text-4xl font-bold text-secondary-500">
                  <AnimatedCounter
                    end={SAMPLE_STATS.totalBribesAmount / 1000000}
                    duration={2000}
                    prefix="KES "
                    suffix="M"
                    decimals={1}
                  />
                </div>
                <p className="text-sm text-neutral-500 mt-2">In reported bribes</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card hoverable className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Verified Cases
                </h3>
                <div className="text-4xl font-bold text-success">
                  <AnimatedCounter
                    end={SAMPLE_STATS.verifiedCases}
                    duration={2000}
                  />
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  {Math.round((SAMPLE_STATS.verifiedCases / SAMPLE_STATS.totalReports) * 100)}% verification rate
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card hoverable className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary-700" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  Counties Covered
                </h3>
                <div className="text-4xl font-bold text-primary-500">
                  {SAMPLE_STATS.countyCount}
                </div>
                <p className="text-sm text-neutral-500 mt-2">All 47 counties</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Report corruption anonymously and securely in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Submit Your Report
              </h3>
              <p className="text-neutral-600">
                Fill out a simple form with details about the corruption incident. Your identity remains completely anonymous.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Get Your Token
              </h3>
              <p className="text-neutral-600">
                Receive a unique tracking token and encryption key. Save these securely to track your report and claim rewards.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Claim Your Reward
              </h3>
              <p className="text-neutral-600">
                Once verified, eligible reports qualify for rewards up to KES 150,000. Track status and claim anonymously.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Report Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                Why Report Corruption?
              </h2>
              <p className="text-lg text-neutral-600">
                Your report makes a difference in the fight against corruption
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary-700" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        100% Anonymous
                      </h3>
                      <p className="text-neutral-600">
                        No personal information required. Your identity is protected with end-to-end encryption.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-success" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Verified & Actioned
                      </h3>
                      <p className="text-neutral-600">
                        Reports are verified using AI and forwarded to EACC for investigation and action.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                        <Award className="w-6 h-6 text-secondary-700" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Earn Rewards
                      </h3>
                      <p className="text-neutral-600">
                        Verified reports are eligible for rewards from KES 5,000 to KES 150,000 based on impact.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="h-full">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-primary-700" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Track Impact
                      </h3>
                      <p className="text-neutral-600">
                        See real-time statistics and track how your report contributes to fighting corruption in Kenya.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-primary-500">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <AlertCircle className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-50 mb-8">
              Your anonymous report can help expose corruption and protect Kenya's future. Every report matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button variant="secondary" size="lg">
                  Report Corruption Now
                </Button>
              </Link>
              <Link to="/statistics">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 border-white text-white hover:bg-white hover:text-primary-700"
                >
                  View Statistics
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">
              In Partnership With
            </h2>
            <div className="flex justify-center items-center space-x-8">
              <div className="text-center">
                <div className="bg-neutral-100 rounded-lg p-8 inline-block">
                  <Shield className="w-16 h-16 text-primary-700 mx-auto mb-2" />
                  <p className="font-bold text-neutral-900">EACC</p>
                  <p className="text-sm text-neutral-600">Ethics & Anti-Corruption Commission</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
