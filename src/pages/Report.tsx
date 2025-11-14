/**
 * Report Page - Corruption Report Submission
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Page for submitting corruption reports with form integration
 */

import { motion } from 'framer-motion';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';
import { ReportForm } from '../components/report/ReportForm';
import { Card } from '../components/ui/Card';

/**
 * Report Page Component
 */
export function Report() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Report Corruption
            </h1>
            <p className="text-xl text-primary-50">
              Your anonymous report can help expose corruption and protect Kenya's future.
              All information is encrypted and completely anonymous.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Assurance Section */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary-700" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">End-to-End Encryption</h3>
                  <p className="text-sm text-neutral-600">Your data is fully encrypted</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">100% Anonymous</h3>
                  <p className="text-sm text-neutral-600">No personal info required</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-secondary-700" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Verified & Actioned</h3>
                  <p className="text-sm text-neutral-600">Forwarded to EACC</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            {/* Report Form */}
            <Card>
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-neutral-200">
                <FileText className="w-6 h-6 text-primary-700" />
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    Corruption Report Form
                  </h2>
                  <p className="text-sm text-neutral-600">
                    All fields marked with * are required
                  </p>
                </div>
              </div>

              <ReportForm />
            </Card>

            {/* Information Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Lock className="w-5 h-5 text-primary-700 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Save Your Token
                    </h3>
                    <p className="text-sm text-neutral-600">
                      After submitting, you'll receive a tracking token and encryption key.
                      Save these securely to track your report and claim rewards.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary-700 mt-1" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">
                      Evidence Guidelines
                    </h3>
                    <p className="text-sm text-neutral-600">
                      Upload clear photos or documents (max 3 files). Remove any metadata
                      that might identify you before uploading.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 bg-warning/10 border border-warning/30 rounded-lg p-6"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Shield className="w-6 h-6 text-warning mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Important Notice
                  </h3>
                  <ul className="text-sm text-neutral-700 space-y-1">
                    <li>• Your report is completely anonymous. We cannot identify you.</li>
                    <li>• False reporting is a serious offense. Only report genuine cases.</li>
                    <li>• Reports are verified using AI before being forwarded to EACC.</li>
                    <li>• You can track your report status using your tracking token.</li>
                    <li>• Verified reports may be eligible for rewards up to KES 150,000.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
