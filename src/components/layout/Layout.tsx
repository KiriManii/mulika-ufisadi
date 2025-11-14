import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

/**
 * Layout Component
 *
 * Main wrapper component that provides consistent layout structure
 * across all pages with Header and Footer. Optionally includes Sidebar
 * for dashboard-style pages.
 */
export function Layout({
  children,
  showSidebar = false,
  className = '',
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (showSidebar) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <main className={`flex-1 ${className}`}>{children}</main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${className}`}>{children}</main>
      <Footer />
    </div>
  );
}

/**
 * Simple Layout Variant
 *
 * Minimal layout without header/footer for special pages
 * like authentication or standalone forms.
 */
export function SimpleLayout({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-h-screen bg-neutral-50 ${className}`}>{children}</div>
  );
}
