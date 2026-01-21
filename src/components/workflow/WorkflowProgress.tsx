'use client';

import React from 'react';
import { CheckCircle, Circle, Lock } from 'lucide-react';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { Card } from '@/components/ui/card';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

const freelancerSteps: WorkflowStep[] = [
  {
    id: 'email-verified',
    title: 'Verify Email',
    description: 'Confirm your email address',
    required: true,
  },
  {
    id: 'profile-completed',
    title: 'Complete Profile',
    description: 'Add your skills and experience',
    required: true,
  },
  {
    id: 'bank-details',
    title: 'Add Bank Details',
    description: 'Set up payment information',
    required: true,
  },
  {
    id: 'first-application',
    title: 'Apply to Job',
    description: 'Submit your first proposal',
    required: false,
  },
  {
    id: 'first-job',
    title: 'Complete Job',
    description: 'Finish your first project',
    required: false,
  },
];

const clientSteps: WorkflowStep[] = [
  {
    id: 'email-verified',
    title: 'Verify Email',
    description: 'Confirm your email address',
    required: true,
  },
  {
    id: 'bank-details',
    title: 'Add Payment Method',
    description: 'Set up payment information',
    required: true,
  },
  {
    id: 'first-job-post',
    title: 'Post a Job',
    description: 'Create your first job posting',
    required: false,
  },
  {
    id: 'hire-freelancer',
    title: 'Hire Freelancer',
    description: 'Accept a proposal',
    required: false,
  },
  {
    id: 'complete-project',
    title: 'Complete Project',
    description: 'Finish your first project',
    required: false,
  },
];

interface WorkflowProgressProps {
  variant?: 'full' | 'compact';
  userRole?: 'freelancer' | 'client';
  showTitle?: boolean;
}

export default function WorkflowProgress({
  variant = 'full',
  userRole,
  showTitle = true,
}: WorkflowProgressProps) {
  const workflow = useWorkflow();
  
  const steps = userRole === 'client' ? clientSteps : freelancerSteps;
  
  const getStepStatus = (stepId: string): 'completed' | 'current' | 'locked' => {
    switch (stepId) {
      case 'email-verified':
        return workflow.state.isEmailVerified ? 'completed' : 'current';
        
      case 'profile-completed':
        if (workflow.state.isProfileCompleted) return 'completed';
        if (!workflow.state.isEmailVerified) return 'locked';
        return 'current';
        
      case 'bank-details':
        if (workflow.state.isBankDetailsCompleted) return 'completed';
        if (userRole === 'freelancer' && !workflow.state.isProfileCompleted) return 'locked';
        if (!workflow.state.isEmailVerified) return 'locked';
        return 'current';
        
      case 'first-application':
        if (workflow.state.hasAppliedToFirstJob) return 'completed';
        if (!workflow.state.isBankDetailsCompleted || !workflow.state.isProfileCompleted) return 'locked';
        return 'current';
        
      case 'first-job-post':
        if (workflow.state.hasPostedFirstJob) return 'completed';
        if (!workflow.state.isBankDetailsCompleted) return 'locked';
        return 'current';
        
      case 'hire-freelancer':
        if (workflow.state.jobsPosted > 0) return 'completed';
        if (!workflow.state.hasPostedFirstJob) return 'locked';
        return 'current';
        
      case 'first-job':
      case 'complete-project':
        if (workflow.state.hasCompletedFirstJob) return 'completed';
        if (userRole === 'freelancer' && !workflow.state.hasAppliedToFirstJob) return 'locked';
        if (userRole === 'client' && !workflow.state.hasPostedFirstJob) return 'locked';
        return 'current';
        
      default:
        return 'current';
    }
  };
  
  const progress = workflow.getWorkflowProgress();
  
  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Account Setup</span>
          <span className="text-sm text-gray-600">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }
  
  return (
    <Card className="p-6">
      {showTitle && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Getting Started</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Complete these steps to unlock all features</p>
            <span className="text-sm font-semibold text-blue-600">{progress}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';
          const isCurrent = status === 'current';
          
          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                isCompleted
                  ? 'bg-green-50 border border-green-200'
                  : isCurrent
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
              } ${isLocked ? 'opacity-60' : ''}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : isLocked ? (
                  <Lock className="w-6 h-6 text-gray-400" />
                ) : (
                  <Circle className="w-6 h-6 text-blue-600" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-semibold ${
                      isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {step.title}
                      {step.required && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">
                          Required
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  </div>
                  
                  {/* Step number */}
                  <span className={`text-sm font-semibold ${
                    isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {index + 1}/{steps.length}
                  </span>
                </div>
                
                {/* Status text */}
                <p className={`text-xs mt-2 ${
                  isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {isCompleted && '✓ Completed'}
                  {isCurrent && !isLocked && '→ In progress'}
                  {isLocked && '🔒 Complete previous steps first'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Call to action */}
      {progress < 100 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Next step:</strong> {steps.find(s => getStepStatus(s.id) === 'current')?.description}
          </p>
        </div>
      )}
      
      {progress === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-semibold">
            🎉 Congratulations! Your account is fully set up.
          </p>
        </div>
      )}
    </Card>
  );
}
