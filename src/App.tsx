/**
 * App Component - Main Application
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Main application component with routing
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home, Report, Dashboard } from './pages';

/**
 * Main App Component
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Report Page */}
          <Route path="/report" element={<Report />} />

          {/* Dashboard/Statistics Page */}
          <Route path="/statistics" element={<Dashboard />} />
          <Route path="/dashboard" element={<Navigate to="/statistics" replace />} />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
