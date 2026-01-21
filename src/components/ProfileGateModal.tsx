'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'profile' | 'bank';
  role: 'freelancer' | 'client';
  returnTo?: string;
}

export default function ProfileGateModal({ 
  isOpen, 
  onClose, 
  type, 
  role,
  returnTo 
}: ProfileGateModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleComplete = () => {
    // Store the return URL for after completion
    if (returnTo) {
      localStorage.setItem('returnAfterGate', returnTo);
    }
    
    if (type === 'profile') {
      router.push(role === 'freelancer' ? '/freelancer/createProfile' : '/client/profile');
    } else {
      router.push('/settings?tab=payment');
    }
    onClose();
  };

  const content = {
    profile: {
      freelancer: {
        title: '🎯 Finish Your Profile First',
        message: 'To apply for jobs, you need to complete your profile so clients can learn about you.',
        action: 'Complete Profile Now'
      },
      client: {
        title: '🏢 Complete Your Company Profile',
        message: 'To post jobs and hire freelancers, please complete your company profile with contact details.',
        action: 'Complete Profile Now'
      }
    },
    bank: {
      freelancer: {
        title: '💳 Add Payment Information',
        message: 'To receive payments for completed work, please add your bank details to your profile.',
        action: 'Add Bank Details'
      },
      client: {
        title: '💳 Add Payment Method',
        message: 'To hire freelancers and make payments, please add your payment information.',
        action: 'Add Payment Method'
      }
    }
  };

  const { title, message, action } = content[type][role];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 mb-8">
            {message}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleComplete}
              className="w-full bg-[#0CF574] hover:bg-[#0CF574]/90 text-gray-900 font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105"
            >
              {action}
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
            >
              I&apos;ll Do This Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
