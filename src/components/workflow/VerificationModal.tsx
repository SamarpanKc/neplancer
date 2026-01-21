'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertCircle, User, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ModalType = 'profile-incomplete' | 'bank-details-incomplete' | 'email-not-verified';

interface VerificationModalProps {
  type: ModalType;
  isOpen: boolean;
  onClose: () => void;
  onProceed?: () => void;
  context?: {
    action?: string; // e.g., "apply to this job", "post a job"
    returnUrl?: string;
  };
}

export default function VerificationModal({
  type,
  isOpen,
  onClose,
  onProceed,
  context,
}: VerificationModalProps) {
  const router = useRouter();
  
  if (!isOpen) return null;
  
  const getModalContent = () => {
    switch (type) {
      case 'profile-incomplete':
        return {
          icon: <User className="w-16 h-16 text-blue-600" />,
          title: 'Complete Your Profile First',
          description: context?.action 
            ? `To ${context.action}, you need to complete your profile with your skills, experience, and work samples.`
            : 'Complete your profile to unlock all platform features and start working on projects.',
          benefits: [
            'Showcase your skills and expertise',
            'Build trust with clients',
            'Stand out from other freelancers',
            'Unlock job applications',
          ],
          primaryButton: 'Complete Profile',
          primaryAction: () => {
            onProceed?.();
            router.push('/profile/create');
            onClose();
          },
        };
        
      case 'bank-details-incomplete':
        return {
          icon: <CreditCard className="w-16 h-16 text-green-600" />,
          title: context?.action?.includes('post') 
            ? 'Add Payment Method to Continue'
            : 'Add Payment Information to Continue',
          description: context?.action
            ? `To ${context.action}, you need to ${context.action.includes('post') ? 'add a payment method' : 'add your bank account details'} first.`
            : 'Add your payment information to receive payments and withdraw your earnings securely.',
          benefits: context?.action?.includes('post')
            ? [
                'Secure payment processing',
                'Multiple payment methods supported',
                'Automatic payment holds for projects',
                'Transaction protection',
              ]
            : [
                'Secure payment processing',
                'Fast withdrawal process',
                'Bank-grade encryption',
                'Multiple payout options',
              ],
          primaryButton: context?.action?.includes('post')
            ? 'Add Payment Method'
            : 'Add Bank Details',
          primaryAction: () => {
            onProceed?.();
            router.push('/profile/settings?tab=payment');
            onClose();
          },
        };
        
      case 'email-not-verified':
        return {
          icon: <AlertCircle className="w-16 h-16 text-orange-600" />,
          title: 'Verify Your Email Address',
          description: 'Please verify your email address to access all platform features. Check your inbox for the verification link.',
          benefits: [
            'Secure your account',
            'Receive important notifications',
            'Enable all platform features',
            'Build trust with your profile',
          ],
          primaryButton: 'Resend Verification Email',
          primaryAction: async () => {
            try {
              const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
              });
              
              if (response.ok) {
                alert('Verification email sent! Please check your inbox.');
              }
            } catch (error) {
              console.error('Failed to resend verification email:', error);
              alert('Failed to send verification email. Please try again.');
            }
          },
          secondaryButton: 'I\'ve Already Verified',
          secondaryAction: () => {
            window.location.reload(); // Reload to check verification status
          },
        };
        
      default:
        return null;
    }
  };
  
  const content = getModalContent();
  if (!content) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {content.icon}
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-3">
          {content.title}
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          {content.description}
        </p>
        
        {/* Benefits */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="font-semibold text-sm mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            Why this matters:
          </p>
          <ul className="space-y-2">
            {content.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={content.primaryAction}
            className="w-full"
          >
            {content.primaryButton}
          </Button>
          
          {content.secondaryButton && (
            <Button
              variant="outline"
              onClick={content.secondaryAction}
              className="w-full"
            >
              {content.secondaryButton}
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
