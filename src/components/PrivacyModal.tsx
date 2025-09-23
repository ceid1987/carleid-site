"use client";

import React from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black/40 backdrop-blur-md rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/20 custom-scrollbar relative">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 z-10 ml-auto mb-0 text-gray-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center transition-colors duration-200"
          aria-label="Close privacy policy"
        >
          ×
        </button>

        <div className="p-6 pt-0">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
          </div>

          <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Data Collection</h3>
              <p>
                When you submit the contact form on this website, the following personal data is collected:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Phone number (optional)</li>
                <li>Message content</li>
                <li>IP address (for rate limiting purposes)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Data Storage</h3>
              <p>
                <strong>Your contact form data is NOT permanently stored in any database.</strong> The information you provide is:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Temporarily processed to send you a confirmation email</li>
                <li>Forwarded to noreply@carleid.dev for response purposes</li>
                <li>Automatically deleted after email transmission</li>
                <li>Rate limiting data (IP addresses) is stored in memory for 24 hours maximum and deleted on server restart</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Data Usage</h3>
              <p>Your data is used exclusively for:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Responding to your inquiry</li>
                <li>Sending you a confirmation email</li>
                <li>Preventing spam through rate limiting</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Third Parties</h3>
              <p>
                Your data is processed through Strapi CMS (hosted on strapiapp.com) for email delivery purposes only.
                No data is shared with any other third parties for marketing or commercial purposes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Your Rights (GDPR)</h3>
              <p>Under GDPR, you have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Request information about data processing</li>
                <li>Request deletion of your data (though it's automatically deleted)</li>
                <li>Withdraw consent at any time</li>
                <li>File a complaint with a supervisory authority</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Contact</h3>
              <p>
                For any privacy-related questions or requests, please contact:
                <span className="text-purple-400"> help@carleid.dev</span>
              </p>
            </div>

            <div className="border-t border-white/20 pt-4 mt-6">
              <p className="text-xs text-gray-400">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;