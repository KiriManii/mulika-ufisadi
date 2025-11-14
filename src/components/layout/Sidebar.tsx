import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Map,
  FileText,
  Award,
  Settings,
  Home,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

/**
 * Sidebar Component
 *
 * Side navigation for dashboard pages with icon-labeled links.
 * Collapsible on mobile with active link highlighting.
 */
export function Sidebar({ isOpen = true, onClose, className = '' }: SidebarProps) {
  const navItems: NavItem[] = [
    {
      to: '/',
      icon: <Home className="w-5 h-5" />,
      label: 'Home',
    },
    {
      to: '/statistics',
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Statistics',
    },
    {
      to: '/map',
      icon: <Map className="w-5 h-5" />,
      label: 'Map View',
    },
    {
      to: '/report',
      icon: <FileText className="w-5 h-5" />,
      label: 'Submit Report',
    },
    {
      to: '/rewards',
      icon: <Award className="w-5 h-5" />,
      label: 'Rewards',
    },
    {
      to: '/settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
    },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary-50 text-primary-700 font-medium'
        : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
    }`;

  // Mobile overlay sidebar
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-neutral-200 z-50 lg:z-0 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64 ${className}`}
      >
        {/* Mobile Close Button */}
        {onClose && (
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 lg:hidden">
            <span className="text-primary-700 text-xl font-bold font-primary">
              Menu
            </span>
            <button
              onClick={onClose}
              className="p-2 text-neutral-700 hover:text-primary-500 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="mb-6 hidden lg:block">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 mb-2">
              Navigation
            </h2>
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navLinkClass}
              onClick={onClose}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-xs text-primary-900 font-medium mb-2">
              Need Help?
            </p>
            <p className="text-xs text-primary-700 mb-3">
              Contact our support team for assistance
            </p>
            <NavLink
              to="/contact"
              className="block text-center text-xs font-medium text-primary-700 hover:text-primary-600 transition-colors duration-200"
              onClick={onClose}
            >
              Get Support
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}
