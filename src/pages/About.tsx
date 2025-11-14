/**
 * About Page
 * Mulika Ufisadi - Corruption Reporting Platform
 */

import { motion } from 'framer-motion';
import { Shield, Users, Lock, Database, FileText, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAnimation } from '../hooks/useAnimation';

export function About() {
  const animations = useAnimation({ duration: 0.5, staggerDelay: 0.1 });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-20"
        {...animations.fadeIn}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Mulika Ufisadi</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Empowering Kenyans to expose corruption anonymously and securely
          </p>
        </div>
      </motion.section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...animations.fadeInUp} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Shield className="w-16 h-16 text-primary-500" />
            </div>
            <h2 className="text-4xl font-bold text-center mb-6 text-neutral-900">
              Our Mission
            </h2>
            <p className="text-lg text-neutral-700 text-center leading-relaxed mb-6">
              Mulika Ufisadi (Swahili: "Expose Corruption") is a groundbreaking platform designed to combat corruption in Kenya by providing citizens with a safe, anonymous, and secure way to report corruption incidents.
            </p>
            <p className="text-lg text-neutral-700 text-center leading-relaxed">
              We believe that transparency and accountability are fundamental to building a prosperous Kenya. By empowering every citizen to speak up without fear, we're creating a movement for change that holds public officials and institutions accountable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.h2
            {...animations.fadeInUp}
            className="text-4xl font-bold text-center mb-12 text-neutral-900"
          >
            How It Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <motion.div {...animations.fadeInUp} className="text-center">
              <Card hoverable className="h-full">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-primary-700">1</span>
                  </div>
                  <FileText className="w-12 h-12 text-primary-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-neutral-900">Report Anonymously</h3>
                  <p className="text-neutral-600">
                    Submit detailed corruption reports without revealing your identity. No registration required.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Step 2 */}
            <motion.div {...animations.fadeInUp} className="text-center">
              <Card hoverable className="h-full">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-secondary-700">2</span>
                  </div>
                  <Database className="w-12 h-12 text-secondary-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-neutral-900">AI Verification</h3>
                  <p className="text-neutral-600">
                    Our ML algorithms analyze and verify reports, detecting patterns and anomalies in corruption data.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Step 3 */}
            <motion.div {...animations.fadeInUp} className="text-center">
              <Card hoverable className="h-full">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-success">3</span>
                  </div>
                  <CheckCircle className="w-12 h-12 text-success mb-4" />
                  <h3 className="text-xl font-semibold mb-4 text-neutral-900">Action & Rewards</h3>
                  <p className="text-neutral-600">
                    Verified reports are forwarded to EACC. Contributors receive rewards for impactful reports.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...animations.fadeInUp} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Database className="w-16 h-16 text-primary-500" />
            </div>
            <h2 className="text-4xl font-bold text-center mb-8 text-neutral-900">
              Data Sources & Methodology
            </h2>
            <div className="space-y-6 text-neutral-700">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">Citizen Reports</h3>
                <p className="leading-relaxed">
                  All data on our platform comes from anonymous citizen reports submitted through our secure web application. Each report undergoes encryption and verification before being included in our database.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">Verification Process</h3>
                <p className="leading-relaxed">
                  Reports are analyzed using machine learning algorithms that detect patterns, anomalies, and potential correlations with existing data. Our system assigns a verification score to each report based on consistency, evidence quality, and cross-referencing with other reports.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">Statistical Analysis</h3>
                <p className="leading-relaxed">
                  We employ advanced statistical methods to aggregate and visualize corruption trends across counties, agencies, and categories. All statistics presented on our platform are derived from verified reports and updated in real-time.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">Transparency</h3>
                <p className="leading-relaxed">
                  We maintain complete transparency in our methodology. While protecting reporter anonymity, we ensure that all aggregated data is accessible to the public, researchers, and law enforcement agencies.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div {...animations.fadeInUp} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Lock className="w-16 h-16 text-primary-500" />
            </div>
            <h2 className="text-4xl font-bold text-center mb-8 text-neutral-900">
              Privacy & Security
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <div className="flex items-start">
                  <Shield className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-neutral-900">Anonymous Reporting</h3>
                    <p className="text-neutral-600">
                      No personal information is collected. Reports are submitted anonymously with unique tracking tokens.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start">
                  <Lock className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-neutral-900">End-to-End Encryption</h3>
                    <p className="text-neutral-600">
                      All reports are encrypted using AES-256 encryption before storage. Only you have the decryption key.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start">
                  <Database className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-neutral-900">Local Storage</h3>
                    <p className="text-neutral-600">
                      Reports are stored locally in your browser. We don't maintain centralized databases of identifiable information.
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-neutral-900">No Tracking</h3>
                    <p className="text-neutral-600">
                      We don't use cookies, analytics, or tracking scripts. Your privacy is our top priority.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="bg-primary-50 border-l-4 border-primary-500 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">Important Security Note</h3>
              <p className="text-neutral-700">
                For maximum security, we recommend using Tor Browser or a VPN when submitting reports. Always save your tracking token and encryption key in a secure location.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partnership with EACC */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div {...animations.fadeInUp} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Award className="w-16 h-16 text-primary-500" />
            </div>
            <h2 className="text-4xl font-bold text-center mb-8 text-neutral-900">
              Partnership with EACC
            </h2>
            <div className="space-y-6 text-neutral-700">
              <p className="text-lg leading-relaxed">
                Mulika Ufisadi works in collaboration with the Ethics and Anti-Corruption Commission (EACC), Kenya's primary anti-corruption agency. Our platform serves as a bridge between citizens and law enforcement.
              </p>
              <div className="bg-neutral-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-neutral-900">How We Work Together</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-0.5" />
                    <span>Verified reports are automatically shared with EACC for investigation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-0.5" />
                    <span>Reporter anonymity is preserved throughout the investigation process</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-0.5" />
                    <span>EACC provides feedback on report status and investigation outcomes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-0.5" />
                    <span>Joint initiatives to raise awareness about corruption prevention</span>
                  </li>
                </ul>
              </div>
              <p className="text-lg leading-relaxed">
                While we maintain operational independence, our shared goal is to create a corruption-free Kenya where integrity, transparency, and accountability are the norm.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team & Credits */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <motion.div {...animations.fadeInUp} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Users className="w-16 h-16 text-primary-500" />
            </div>
            <h2 className="text-4xl font-bold text-center mb-8 text-neutral-900">
              Team & Credits
            </h2>
            <div className="space-y-6 text-neutral-700">
              <p className="text-lg leading-relaxed text-center">
                Mulika Ufisadi is built by a team of passionate Kenyan developers, designers, data scientists, and anti-corruption advocates committed to creating positive change.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-900">Development Team</h3>
                  <p className="text-neutral-600">
                    Software engineers and security experts dedicated to building a robust, secure, and user-friendly platform.
                  </p>
                </Card>

                <Card>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-900">Data Science Team</h3>
                  <p className="text-neutral-600">
                    ML engineers and statisticians developing algorithms for report verification and pattern detection.
                  </p>
                </Card>

                <Card>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-900">Legal Advisors</h3>
                  <p className="text-neutral-600">
                    Legal experts ensuring compliance with Kenyan law and protecting whistleblower rights.
                  </p>
                </Card>

                <Card>
                  <h3 className="text-xl font-semibold mb-3 text-neutral-900">Community Partners</h3>
                  <p className="text-neutral-600">
                    Civil society organizations and anti-corruption advocates helping amplify our impact.
                  </p>
                </Card>
              </div>

              <div className="bg-primary-50 p-6 rounded-lg mt-8">
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 text-center">
                  Open Source & Transparency
                </h3>
                <p className="text-center text-neutral-700">
                  We believe in transparency. Our platform's source code is available for public audit, and we welcome contributions from the community to help improve Mulika Ufisadi.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        {...animations.fadeIn}
        className="py-16 bg-gradient-to-r from-primary-700 to-primary-500 text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Fight Against Corruption</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Every report matters. Your voice can make a difference.
          </p>
          <a
            href="/report"
            className="inline-block bg-secondary-500 hover:bg-secondary-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-300 transform hover:scale-105"
          >
            Report Corruption Now
          </a>
        </div>
      </motion.section>
    </div>
  );
}
