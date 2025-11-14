import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * Header Component
 *
 * Top navigation bar with logo, menu, and CTA button.
 * Features responsive mobile menu and sticky positioning.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-neutral-700 hover:text-primary-500 transition-colors duration-200 font-medium ${
      isActive ? 'text-primary-500' : ''
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 px-4 text-neutral-700 hover:text-primary-500 hover:bg-neutral-50 transition-colors duration-200 rounded-lg ${
      isActive ? 'text-primary-500 bg-primary-50' : ''
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-primary-700 text-2xl font-bold font-primary hover:text-primary-600 transition-colors duration-200"
          onClick={closeMobileMenu}
        >
          Mulika Ufisadi
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/report" className={navLinkClass}>
            Report
          </NavLink>
          <NavLink to="/statistics" className={navLinkClass}>
            Statistics
          </NavLink>
          <NavLink to="/map" className={navLinkClass}>
            Map
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        {/* CTA Button - Desktop */}
        <Link
          to="/report"
          className="hidden md:inline-flex items-center px-6 py-2 bg-secondary-500 hover:bg-secondary-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          Report Corruption
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-1">
            <NavLink
              to="/"
              className={mobileNavLinkClass}
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/report"
              className={mobileNavLinkClass}
              onClick={closeMobileMenu}
            >
              Report
            </NavLink>
            <NavLink
              to="/statistics"
              className={mobileNavLinkClass}
              onClick={closeMobileMenu}
            >
              Statistics
            </NavLink>
            <NavLink
              to="/map"
              className={mobileNavLinkClass}
              onClick={closeMobileMenu}
            >
              Map
            </NavLink>
            <NavLink
              to="/about"
              className={mobileNavLinkClass}
              onClick={closeMobileMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={mobileNavLinkClass}
              onClick={closeMobileMenu}
            >
              Contact
            </NavLink>

            {/* CTA Button - Mobile */}
            <div className="pt-4">
              <Link
                to="/report"
                className="block w-full text-center px-6 py-3 bg-secondary-500 hover:bg-secondary-700 text-white rounded-lg font-medium transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Report Corruption
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
