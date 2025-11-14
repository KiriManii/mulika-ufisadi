/**
 * Token Display Component
 * Mulika Ufisadi - Corruption Reporting Platform
 * Shows the tracking token after successful report submission
 */

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface TokenDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: string;
  encryptionKey: string;
}

/**
 * Generates a QR code data URL for the given text
 * Uses Google Charts API as a simple solution (no external dependencies needed)
 * For production, consider using a library like qrcode.react for offline support
 */
function generateQRCode(text: string, size: number = 200): string {
  const encodedText = encodeURIComponent(text);
  return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodedText}&choe=UTF-8`;
}

export function TokenDisplay({
  isOpen,
  onClose,
  tokenId,
  encryptionKey,
}: TokenDisplayProps) {
  const tokenRef = useRef<HTMLDivElement>(null);
  const keyRef = useRef<HTMLDivElement>(null);

  const qrCodeUrl = generateQRCode(tokenId);

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(tokenId);
      alert('Token copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy token:', error);
      alert('Failed to copy token. Please copy it manually.');
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(encryptionKey);
      alert('Encryption key copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy key:', error);
      alert('Failed to copy key. Please copy it manually.');
    }
  };

  const handleDownload = () => {
    const content = `
MULIKA UFISADI - CORRUPTION REPORT
==================================

IMPORTANT: Save this information securely!

Tracking Token: ${tokenId}
Encryption Key: ${encryptionKey}

Instructions:
1. Keep this information safe and confidential
2. You will need both the token and encryption key to claim rewards
3. Do not share this information with anyone
4. To track your report, visit: https://mulikaufisadi.org/track
5. To claim rewards, visit: https://mulikaufisadi.org/rewards

Report submitted on: ${new Date().toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}

Thank you for helping fight corruption in Kenya!
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mulika-ufisadi-${tokenId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Submitted Successfully"
      size="lg"
    >
      <div className="space-y-6">
        {/* Success Message */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center"
        >
          <div className="bg-green-100 rounded-full p-4">
            <svg
              className="w-16 h-16 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </motion.div>

        <div className="text-center">
          <p className="text-lg text-neutral-700 font-primary">
            Your corruption report has been submitted anonymously and securely.
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-base font-semibold text-red-900 font-primary mb-1">
                IMPORTANT: Save This Information!
              </h3>
              <p className="text-sm text-red-700 font-primary">
                You will need both the tracking token and encryption key to claim rewards.
                We cannot recover this information if lost.
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Token */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-neutral-700 font-primary mb-3">
            Tracking Token
          </h3>
          <div
            ref={tokenRef}
            className="bg-white border-2 border-primary-300 rounded-lg p-4 mb-4"
          >
            <p className="text-3xl font-bold text-primary-700 font-secondary text-center break-all">
              {tokenId}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-lg border-2 border-primary-300">
              <img
                src={qrCodeUrl}
                alt={`QR Code for token ${tokenId}`}
                className="w-48 h-48"
                loading="lazy"
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToken}
            fullWidth
            icon={
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            }
          >
            Copy Token
          </Button>
        </div>

        {/* Encryption Key */}
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-neutral-700 font-primary mb-3">
            Encryption Key
          </h3>
          <div
            ref={keyRef}
            className="bg-white border-2 border-secondary-300 rounded-lg p-4 mb-4"
          >
            <p className="text-xl font-bold text-secondary-700 font-secondary text-center break-all">
              {encryptionKey}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyKey}
            fullWidth
            icon={
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            }
          >
            Copy Encryption Key
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-neutral-900 font-primary mb-2">
            Next Steps:
          </h3>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-neutral-700 font-primary">
            <li>Download or screenshot this information immediately</li>
            <li>Store it in a secure location (password manager recommended)</li>
            <li>Your report will be reviewed and verified by our team</li>
            <li>If verified, you may be eligible for a reward (KES 5,000 - 150,000)</li>
            <li>Check your report status at: mulikaufisadi.org/track</li>
            <li>Claim rewards at: mulikaufisadi.org/rewards</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={handleDownload}
            fullWidth
            icon={
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            }
          >
            Download Information
          </Button>

          <Button
            variant="outline"
            onClick={handlePrint}
            fullWidth
            icon={
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
            }
          >
            Print
          </Button>

          <Button variant="primary" onClick={onClose} fullWidth>
            I've Saved This Information
          </Button>
        </div>

        {/* Security Note */}
        <div className="text-center">
          <p className="text-xs text-neutral-500 font-primary">
            Your report is encrypted and stored securely. We do not collect any personally
            identifiable information.
          </p>
        </div>
      </div>
    </Modal>
  );
}
