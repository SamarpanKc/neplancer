'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function WelcomeBanner() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is first-time user
    const isFirstTime = localStorage.getItem('firstTimeUser');
    if (isFirstTime === 'true' && user) {
      setIsVisible(true);
    }
  }, [user]);

  const handleDismiss = () => {
    localStorage.removeItem('firstTimeUser');
    setIsVisible(false);
  };

  if (!isVisible || !user) return null;

  const tips = {
    freelancer: [
      'Complete your profile to attract more clients',
      'Add your skills and portfolio to stand out',
      'Set up your bank details to receive payments',
      'Browse jobs and start applying today!'
    ],
    client: [
      'Complete your company profile to build trust',
      'Post detailed job descriptions to attract the right talent',
      'Add payment information to hire freelancers quickly',
      'Browse our talented freelancer community'
    ]
  };

  const roleTips = user.role === 'freelancer' ? tips.freelancer : tips.client;

  return (
    <div className="bg-gradient-to-r from-[#0CF574]/20 via-[#0CF574]/10 to-transparent border-l-4 border-[#0CF574] p-6 rounded-lg mb-6 relative animate-in fade-in slide-in-from-top duration-500">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 bg-[#0CF574] rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            🎉 Welcome to NepLancer!
          </h3>
          <p className="text-gray-700 mb-4">
            {user.role === 'freelancer' 
              ? "Let's help you find your next great project!" 
              : "Let's help you find the perfect freelancer for your project!"}
          </p>

          <div className="space-y-2">
            <p className="font-semibold text-gray-800 text-sm">Quick Tips to Get Started:</p>
            <ul className="space-y-2">
              {roleTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[#0CF574] font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
