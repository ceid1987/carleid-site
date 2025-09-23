"use client";

import React, { useState } from 'react';
import PrivacyModal from './PrivacyModal';

const Footer: React.FC = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <>
      <footer className="w-full py-6 mt-auto border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-sm text-gray-400 hover:text-purple-400 underline transition-colors duration-200"
          >
            privacy policy
          </button>
        </div>
      </footer>

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
};

export default Footer;