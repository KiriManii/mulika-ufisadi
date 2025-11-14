/**
 * App Component - Main Application
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Main application component with complete routing, lazy loading, and error boundaries
 */

import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layout components (not lazy loaded for better UX)
import { Layout } from './components/layout/Layout';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Report = lazy(() => import('./pages/Report').then(module => ({ default: module.Report })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Map = lazy(() => import('./pages/Map').then(module => ({ default: module.Map })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const Rewards = lazy(() => import('./pages/Rewards').then(module => ({ default: module.Rewards })));

/**
 * Loading Fallback Component
 * Displays while pages are being loaded
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <motion.div
            className="absolute inset-0 border-4 border-primary-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Loading text */}
        <div className="text-neutral-700 font-medium">Loading...</div>
      </motion.div>
    </div>
  );
}

/**
 * Error Boundary Fallback Component
 * Displays when an error occurs during page rendering
 */
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Error icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error message */}
        <h1 className="text-2xl font-bold text-neutral-900 text-center mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-neutral-600 text-center mb-6">
          We encountered an unexpected error. Please try again.
        </p>

        {/* Error details (in development) */}
        {import.meta.env.DEV && (
          <details className="mb-6">
            <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700 mb-2">
              Error details
            </summary>
            <pre className="text-xs bg-neutral-100 p-4 rounded-lg overflow-auto max-h-40 text-danger">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={resetError}
            className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200"
            aria-label="Try again"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 px-6 py-3 border-2 border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded-lg font-medium transition-colors duration-200"
            aria-label="Go to homepage"
          >
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Error Boundary Class Component
 * Catches errors in child components
 */
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Scroll to Top Component
 * Scrolls to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * Animated Routes Component
 * Wraps routes with page transitions
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Report Page */}
        <Route path="/report" element={<Report />} />

        {/* Dashboard/Statistics Page */}
        <Route path="/statistics" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/statistics" replace />} />

        {/* Map Page */}
        <Route path="/map" element={<Map />} />

        {/* About Page */}
        <Route path="/about" element={<About />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />

        {/* Rewards Page */}
        <Route path="/rewards" element={<Rewards />} />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Main App Component
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
