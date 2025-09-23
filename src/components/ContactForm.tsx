"use client";

import React, { useState } from 'react';
import { ContactFormData } from '../app/api/contact/route';
import { PhoneInput } from './ui/phone-input';
import PrivacyModal from './PrivacyModal';

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [phoneValue, setPhoneValue] = useState<string | undefined>('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneValue(value);
    setFormData(prev => ({
      ...prev,
      phone: value || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Message sent successfully!'
        });
        // Reset form on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
        setPhoneValue('');
        setPrivacyAccepted(false);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
              placeholder="Your first name"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
              placeholder="Your last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <PhoneInput
            placeholder="Enter phone number"
            value={phoneValue}
            onChange={handlePhoneChange}
            defaultCountry="US"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-vertical"
            placeholder="Tell me about your project or just say hello..."
          />
        </div>

        {submitStatus.type && (
          <div className={`p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-green-900/50 border border-green-500 text-green-200'
              : 'bg-red-900/50 border border-red-500 text-red-200'
          }`}>
            {submitStatus.message}
          </div>
        )}

        {/* Privacy Policy Checkbox */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="privacy-policy"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1 w-3 h-3 appearance-none bg-white border border-white/50 rounded-sm checked:bg-purple-600 checked:border-purple-600 focus:ring-purple-500/50 focus:ring-1 cursor-pointer relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center transition-all duration-200"
            required
          />
          <label htmlFor="privacy-policy" className="text-sm text-gray-300">
            I have read and acknowledged the{' '}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-purple-400 hover:text-purple-300 underline transition-colors"
            >
              privacy policy
            </button>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !privacyAccepted}
          className={`w-auto font-medium py-3 px-8 rounded-full transition-all duration-200 flex items-center justify-center border mx-auto ${
            isSubmitting || !privacyAccepted
              ? 'bg-transparent border-white text-white cursor-not-allowed'
              : 'bg-purple-600 border-purple-600 text-white hover:bg-purple-500 hover:border-purple-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};

export default ContactForm;