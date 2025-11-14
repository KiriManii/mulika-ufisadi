import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MessageCircle,
  Twitter,
  Facebook,
  Instagram,
} from 'lucide-react';

/**
 * Footer Component
 *
 * Site footer with three columns: branding, quick links, and contact info.
 * Responsive layout that stacks on mobile and spreads to 3 columns on desktop.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1: Logo + Tagline */}
          <div className="space-y-4">
            <Link
              to="/"
              className="text-primary-500 text-2xl font-bold font-primary inline-block hover:text-primary-400 transition-colors duration-200"
            >
              Mulika Ufisadi
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Expose Corruption. Protect Kenya.
            </p>
            <p className="text-neutral-500 text-xs leading-relaxed">
              An anonymous platform for reporting corruption and promoting
              transparency in government services across Kenya.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold font-primary">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about#how-it-works"
                  className="text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/report"
                  className="text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  Report Corruption
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className="text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  Statistics
                </Link>
              </li>
              <li>
                <Link
                  to="/rewards"
                  className="text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  Rewards Program
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info + Social */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold font-primary">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@mulikaufisadi.org"
                  className="flex items-center gap-2 text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>info@mulikaufisadi.org</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+254700123456"
                  className="flex items-center gap-2 text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+254 700 123 456</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254700123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-neutral-300 hover:text-primary-500 transition-colors duration-200 text-sm"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>WhatsApp: +254 700 123 456</span>
                </a>
              </li>
            </ul>

            {/* Social Media Links */}
            <div className="pt-4">
              <h4 className="text-white text-sm font-medium mb-3">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com/mulikaufisadi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 hover:bg-primary-500 hover:text-white transition-all duration-200"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/mulikaufisadi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 hover:bg-primary-500 hover:text-white transition-all duration-200"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/mulikaufisadi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 hover:bg-primary-500 hover:text-white transition-all duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-500 text-sm text-center md:text-left">
              &copy; {currentYear} Mulika Ufisadi. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-neutral-500 hover:text-primary-500 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-neutral-500 hover:text-primary-500 transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
