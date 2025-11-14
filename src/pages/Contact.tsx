/**
 * Contact Page
 * Mulika Ufisadi - Corruption Reporting Platform
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAnimation } from '../hooks/useAnimation';

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(1000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const animations = useAnimation({ duration: 0.5, staggerDelay: 0.1 });
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Contact form submitted:', data);
      setSubmitted(true);
      reset();

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-20"
        {...animations.fadeIn}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you fight corruption.
          </p>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div {...animations.fadeInLeft} className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-neutral-900">Get In Touch</h2>
              <p className="text-neutral-700 text-lg mb-8">
                Have questions about reporting corruption? Need technical support? Want to partner with us?
                We'd love to hear from you.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Email */}
              <Card hoverable>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-neutral-900">Email</h3>
                    <a
                      href="mailto:info@mulikaufisadi.org"
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      info@mulikaufisadi.org
                    </a>
                    <p className="text-sm text-neutral-600 mt-1">
                      For general inquiries and support
                    </p>
                  </div>
                </div>
              </Card>

              {/* Phone */}
              <Card hoverable>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-secondary-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-neutral-900">Phone</h3>
                    <a
                      href="tel:+254700123456"
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      +254 700 123 456
                    </a>
                    <p className="text-sm text-neutral-600 mt-1">
                      Mon-Fri: 8AM - 5PM EAT
                    </p>
                  </div>
                </div>
              </Card>

              {/* WhatsApp */}
              <Card hoverable>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-neutral-900">WhatsApp</h3>
                    <a
                      href="https://wa.me/254700123456"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      +254 700 123 456
                    </a>
                    <p className="text-sm text-neutral-600 mt-1">
                      Quick responses, secure messaging
                    </p>
                  </div>
                </div>
              </Card>

              {/* Office Location */}
              <Card hoverable>
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1 text-neutral-900">Office</h3>
                    <p className="text-neutral-700">
                      Integrity House, 2nd Floor<br />
                      Harambee Avenue<br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-neutral-900">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/mulikaufisadi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6 text-primary-700" />
                </a>
                <a
                  href="https://facebook.com/mulikaufisadi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6 text-primary-700" />
                </a>
                <a
                  href="https://instagram.com/mulikaufisadi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6 text-primary-700" />
                </a>
                <a
                  href="https://linkedin.com/company/mulikaufisadi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6 text-primary-700" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div {...animations.fadeInRight}>
            <Card>
              <h2 className="text-2xl font-bold mb-6 text-neutral-900">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-success/10 border border-success rounded-lg flex items-start">
                  <CheckCircle className="w-6 h-6 text-success mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-success mb-1">Message Sent!</h4>
                    <p className="text-sm text-neutral-700">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <Input
                    label="Name"
                    type="text"
                    placeholder="Your full name"
                    {...register('name')}
                    error={errors.name?.message}
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register('email')}
                    error={errors.email?.message}
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <Input
                    label="Subject"
                    type="text"
                    placeholder="What is this about?"
                    {...register('subject')}
                    error={errors.subject?.message}
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    placeholder="Tell us how we can help..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.message
                        ? 'border-danger focus:border-danger focus:ring-danger/20'
                        : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-100'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-danger">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  icon={<Send className="w-5 h-5" />}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* EACC Referral Info */}
        <motion.div {...animations.fadeInUp} className="mt-16 max-w-4xl mx-auto">
          <Card>
            <div className="flex items-start">
              <AlertCircle className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900">
                  Reporting Directly to EACC
                </h3>
                <p className="text-neutral-700 mb-4">
                  While Mulika Ufisadi provides a secure and anonymous platform for reporting corruption,
                  you can also report directly to the Ethics and Anti-Corruption Commission (EACC):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">EACC Contact</h4>
                    <ul className="space-y-2 text-neutral-700">
                      <li className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-primary-500" />
                        <span>+254 20 271 0000</span>
                      </li>
                      <li className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-primary-500" />
                        <span>report@eacc.go.ke</span>
                      </li>
                      <li className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2 text-primary-500" />
                        <span>SMS: 0713 986 000</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">EACC Office</h4>
                    <p className="text-neutral-700">
                      Integrity Centre<br />
                      Milimani Road, Nairobi<br />
                      P.O. Box 61130-00200<br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-neutral-700">
                    <strong className="text-neutral-900">Note:</strong> When you submit a verified report through Mulika Ufisadi,
                    it is automatically forwarded to EACC while protecting your anonymity. However, you're free to
                    contact EACC directly if you prefer.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div {...animations.fadeInUp} className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-neutral-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                Is my report really anonymous?
              </h3>
              <p className="text-neutral-700">
                Yes, absolutely. We don't collect any personal information, and all reports are encrypted.
                You receive a tracking token to follow up on your report without revealing your identity.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                How long does it take to process a report?
              </h3>
              <p className="text-neutral-700">
                Reports are verified within 24-48 hours. Once verified, they're forwarded to EACC.
                Investigation timelines vary depending on the complexity of the case.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                Can I get updates on my report?
              </h3>
              <p className="text-neutral-700">
                Yes! Use your tracking token on the Rewards page to check the status of your report and
                any potential rewards.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                How are rewards determined?
              </h3>
              <p className="text-neutral-700">
                Rewards are based on the impact and verification score of your report. Reports that lead
                to successful prosecutions or significant corruption exposures receive higher rewards.
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
