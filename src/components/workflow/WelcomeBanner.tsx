'use client';

import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, MessageCircle, Shield, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WelcomeBannerProps {
  userRole: 'freelancer' | 'client';
  userName?: string;
  onDismiss: () => void;
  variant?: 'first-time' | 'post-verification' | 'post-profile-setup';
}

export default function WelcomeBanner({
  userRole,
  userName,
  onDismiss,
  variant = 'first-time',
}: WelcomeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation
  };
  
  if (!isVisible) return null;
  
  // Content variations based on role and variant
  const getContent = () => {
    if (userRole === 'freelancer') {
      switch (variant) {
        case 'first-time':
          return {
            title: `Welcome${userName ? `, ${userName}` : ''}! 🎉`,
            subtitle: 'Start browsing jobs and launch your freelancing career',
            description: 'Complete your profile to unlock job applications and start earning.',
            actions: [
              { label: 'Browse Jobs', href: '/jobs', primary: true },
              { label: 'Complete Profile', href: '/profile/create', primary: false },
            ],
            tips: [
              { icon: <TrendingUp className="w-5 h-5" />, text: 'Complete your profile to stand out' },
              { icon: <Shield className="w-5 h-5" />, text: 'Add portfolio items to build trust' },
              { icon: <MessageCircle className="w-5 h-5" />, text: 'Respond quickly to get hired faster' },
            ],
          };
          
        case 'post-verification':
          return {
            title: 'Email Verified! ✓',
            subtitle: 'You\'re all set to start applying to jobs',
            description: 'Your account is now verified. Complete your profile to unlock all features.',
            actions: [
              { label: 'Complete Profile Now', href: '/profile/create', primary: true },
              { label: 'Browse Jobs First', href: '/jobs', primary: false },
            ],
          };
          
        case 'post-profile-setup':
          return {
            title: 'Profile Completed! 🚀',
            subtitle: 'You\'re ready to apply to jobs and start earning',
            description: 'Your profile looks great! Start applying to jobs that match your skills.',
            actions: [
              { label: 'Browse Jobs', href: '/jobs', primary: true },
              { label: 'View My Profile', href: '/profile', primary: false },
            ],
            tips: [
              { icon: <Sparkles className="w-5 h-5" />, text: 'Apply early to increase your chances' },
              { icon: <MessageCircle className="w-5 h-5" />, text: 'Personalize your proposals' },
              { icon: <TrendingUp className="w-5 h-5" />, text: 'Build your reputation with great work' },
            ],
          };
          
        default:
          return null;
      }
    } else {
      // Client content
      switch (variant) {
        case 'first-time':
          return {
            title: `Welcome${userName ? `, ${userName}` : ''}! 🎉`,
            subtitle: 'Find talented freelancers for your projects',
            description: 'Post your first job to connect with skilled professionals.',
            actions: [
              { label: 'Post a Job', href: '/jobs/post', primary: true },
              { label: 'Browse Freelancers', href: '/freelancers', primary: false },
            ],
            tips: [
              { icon: <Sparkles className="w-5 h-5" />, text: 'Write clear job descriptions' },
              { icon: <Shield className="w-5 h-5" />, text: 'Review freelancer portfolios' },
              { icon: <TrendingUp className="w-5 h-5" />, text: 'Start with small test projects' },
            ],
          };
          
        case 'post-verification':
          return {
            title: 'Email Verified! ✓',
            subtitle: 'Ready to post your first job',
            description: 'Add a payment method to start hiring talented freelancers.',
            actions: [
              { label: 'Post Your First Job', href: '/jobs/post', primary: true },
              { label: 'Explore Freelancers', href: '/freelancers', primary: false },
            ],
          };
          
        case 'post-profile-setup':
          return {
            title: 'All Set! 🚀',
            subtitle: 'Your account is ready to post jobs',
            description: 'Find the perfect freelancer for your project in minutes.',
            actions: [
              { label: 'Post a Job Now', href: '/jobs/post', primary: true },
              { label: 'View Dashboard', href: '/dashboard', primary: false },
            ],
            tips: [
              { icon: <Sparkles className="w-5 h-5" />, text: 'Set realistic budgets' },
              { icon: <MessageCircle className="w-5 h-5" />, text: 'Communicate expectations clearly' },
              { icon: <Shield className="w-5 h-5" />, text: 'Check freelancer reviews' },
            ],
          };
          
        default:
          return null;
      }
    }
  };
  
  const content = getContent();
  if (!content) return null;
  
  return (
    <div className="animate-in slide-in-from-top duration-500">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 mb-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
            <p className="text-lg text-white/90">{content.subtitle}</p>
            <p className="text-sm text-white/80 mt-2">{content.description}</p>
          </div>
          
          {/* Tips */}
          {content.tips && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {content.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3"
                >
                  <div className="text-white/90 mt-0.5">{tip.icon}</div>
                  <span className="text-sm text-white/90">{tip.text}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {content.actions.map((action, index) => (
              <Button
                key={index}
                variant={action.primary ? 'default' : 'outline'}
                onClick={() => {
                  window.location.href = action.href;
                }}
                className={
                  action.primary
                    ? 'bg-white text-blue-600 hover:bg-white/90'
                    : 'border-white text-white hover:bg-white/20'
                }
              >
                {action.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
