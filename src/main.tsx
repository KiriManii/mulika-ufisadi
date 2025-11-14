/**
 * Main Entry Point
 * Mulika Ufisadi - Corruption Reporting Platform
 *
 * Application entry point with providers and global configuration
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import global styles
import './index.css';

// Import fonts
import '@fontsource-variable/onest';
import '@fontsource/jetbrains-mono';

/**
 * Update document title and meta tags
 */
function updateDocumentMetadata() {
  // Update title
  document.title = 'Mulika Ufisadi - Expose Corruption. Protect Kenya.';

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      'content',
      'Anonymous corruption reporting platform for Kenya. Report corruption safely and help build a transparent society.'
    );
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Anonymous corruption reporting platform for Kenya. Report corruption safely and help build a transparent society.';
    document.head.appendChild(meta);
  }

  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute(
      'content',
      'corruption, Kenya, EACC, reporting, transparency, accountability, anonymous reporting'
    );
  } else {
    const meta = document.createElement('meta');
    meta.name = 'keywords';
    meta.content = 'corruption, Kenya, EACC, reporting, transparency, accountability, anonymous reporting';
    document.head.appendChild(meta);
  }

  // Update theme color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', '#4A90E2');
  } else {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#4A90E2';
    document.head.appendChild(meta);
  }
}

/**
 * Initialize application
 */
function initializeApp() {
  // Update document metadata
  updateDocumentMetadata();

  // Get root element
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found. Please ensure there is a <div id="root"></div> in your HTML.');
  }

  // Create React root and render app
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

/**
 * Handle initialization errors
 */
try {
  initializeApp();
} catch (error) {
  console.error('Failed to initialize application:', error);

  // Display error message to user
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background-color: #F8FAFC;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      ">
        <div style="
          max-width: 28rem;
          width: 100%;
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          padding: 2rem;
          text-align: center;
        ">
          <div style="
            width: 4rem;
            height: 4rem;
            background-color: rgba(239, 68, 68, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
          ">
            <svg style="width: 2rem; height: 2rem; color: #EF4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h1 style="font-size: 1.5rem; font-weight: bold; color: #0F172A; margin-bottom: 0.5rem;">
            Failed to Load Application
          </h1>
          <p style="color: #64748B; margin-bottom: 1.5rem;">
            We encountered an error while loading the application. Please refresh the page to try again.
          </p>
          <button
            onclick="window.location.reload()"
            style="
              width: 100%;
              padding: 0.75rem 1.5rem;
              background-color: #4A90E2;
              color: white;
              border: none;
              border-radius: 0.5rem;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            "
            onmouseover="this.style.backgroundColor='#3A7BC8'"
            onmouseout="this.style.backgroundColor='#4A90E2'"
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Service Worker Registration (for PWA support)
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
