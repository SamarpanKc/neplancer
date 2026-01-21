'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useWorkflow } from '@/contexts/WorkflowContext';
import VerificationModal from '@/components/workflow/VerificationModal';

type GuardType = 'email-verified' | 'profile-complete' | 'bank-details-complete' | 'authenticated';

interface WorkflowGuardProps {
  children: React.ReactNode;
  require?: GuardType[];
  fallbackPath?: string;
  showModal?: boolean;
  context?: {
    action?: string;
  };
}

/**
 * WorkflowGuard - Protects routes and actions based on user workflow state
 * 
 * Usage:
 * <WorkflowGuard require={['authenticated', 'profile-complete']}>
 *   <ProtectedContent />
 * </WorkflowGuard>
 */
export default function WorkflowGuard({
  children,
  require = [],
  fallbackPath,
  showModal = true,
  context,
}: WorkflowGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const authLoading = false; // TODO: Add loading state to useAuth
  const { state, checkProfileComplete, checkBankDetailsComplete } = useWorkflow();
  
  const [isChecking, setIsChecking] = useState(true);
  const [modalType, setModalType] = useState<'profile-incomplete' | 'bank-details-incomplete' | 'email-not-verified' | null>(null);
  const [canAccess, setCanAccess] = useState(false);
  
  useEffect(() => {
    const checkRequirements = async () => {
      if (authLoading) return;
      
      setIsChecking(true);
      
      // Check authentication
      if (require.includes('authenticated')) {
        if (!user) {
          router.push(fallbackPath || `/auth/login?redirect=${pathname}`);
          return;
        }
      }
      
      // Check email verification
      if (require.includes('email-verified')) {
        if (!state.isEmailVerified) {
          if (showModal) {
            setModalType('email-not-verified');
            setCanAccess(false);
            setIsChecking(false);
            return;
          } else {
            router.push(fallbackPath || '/auth/verify-email');
            return;
          }
        }
      }
      
      // Check profile completion
      if (require.includes('profile-complete')) {
        const isComplete = await checkProfileComplete();
        if (!isComplete) {
          if (showModal) {
            setModalType('profile-incomplete');
            setCanAccess(false);
            setIsChecking(false);
            return;
          } else {
            router.push(fallbackPath || '/profile/create');
            return;
          }
        }
      }
      
      // Check bank details
      if (require.includes('bank-details-complete')) {
        const isComplete = await checkBankDetailsComplete();
        if (!isComplete) {
          if (showModal) {
            setModalType('bank-details-incomplete');
            setCanAccess(false);
            setIsChecking(false);
            return;
          } else {
            router.push(fallbackPath || '/profile/settings?tab=payment');
            return;
          }
        }
      }
      
      // All checks passed
      setCanAccess(true);
      setIsChecking(false);
    };
    
    checkRequirements();
  }, [user, authLoading, require, state, pathname, router, fallbackPath, showModal, checkProfileComplete, checkBankDetailsComplete]);
  
  // Show loading state
  if (authLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }
  
  // Show modal if requirements not met
  if (!canAccess && modalType) {
    return (
      <>
        <VerificationModal
          type={modalType}
          isOpen={true}
          onClose={() => {
            setModalType(null);
            if (fallbackPath) {
              router.push(fallbackPath);
            } else {
              router.back();
            }
          }}
          context={context}
        />
        {/* Optionally show blurred content behind modal */}
        <div className="filter blur-sm pointer-events-none">
          {children}
        </div>
      </>
    );
  }
  
  // Render protected content
  if (canAccess) {
    return <>{children}</>;
  }
  
  return null;
}

/**
 * Hook for programmatic workflow checks
 */
export function useWorkflowGuard() {
  const router = useRouter();
  const { state, checkProfileComplete, checkBankDetailsComplete } = useWorkflow();
  
  const checkCanApply = async (jobId: string): Promise<{
    canApply: boolean;
    reason?: 'email-not-verified' | 'profile-incomplete' | 'bank-details-incomplete';
  }> => {
    // Save job ID for redirect
    if (jobId) {
      // Job ID will be used if verification needed
    }
    
    if (!state.isEmailVerified) {
      return { canApply: false, reason: 'email-not-verified' };
    }
    
    const profileComplete = await checkProfileComplete();
    if (!profileComplete) {
      return { canApply: false, reason: 'profile-incomplete' };
    }
    
    const bankComplete = await checkBankDetailsComplete();
    if (!bankComplete) {
      return { canApply: false, reason: 'bank-details-incomplete' };
    }
    
    return { canApply: true };
  };
  
  const checkCanPostJob = async (): Promise<{
    canPost: boolean;
    reason?: 'email-not-verified' | 'bank-details-incomplete';
  }> => {
    if (!state.isEmailVerified) {
      return { canPost: false, reason: 'email-not-verified' };
    }
    
    const bankComplete = await checkBankDetailsComplete();
    if (!bankComplete) {
      return { canPost: false, reason: 'bank-details-incomplete' };
    }
    
    return { canPost: true };
  };
  
  const redirectToProfileSetup = (returnUrl?: string) => {
    const url = returnUrl ? `/profile/create?return=${encodeURIComponent(returnUrl)}` : '/profile/create';
    router.push(url);
  };
  
  const redirectToBankSetup = (returnUrl?: string) => {
    const url = returnUrl 
      ? `/profile/settings?tab=payment&return=${encodeURIComponent(returnUrl)}` 
      : '/profile/settings?tab=payment';
    router.push(url);
  };
  
  return {
    state,
    checkCanApply,
    checkCanPostJob,
    redirectToProfileSetup,
    redirectToBankSetup,
  };
}
