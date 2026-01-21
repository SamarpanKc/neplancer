'use client';

import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  isNextDisabled?: boolean;
  isLastStep?: boolean;
  showSkip?: boolean;
  isSaving?: boolean;
}

export default function MultiStepForm({
  steps,
  currentStep,
  children,
  onNext,
  onBack,
  onSkip,
  isNextDisabled = false,
  isLastStep = false,
  showSkip = false,
  isSaving = false,
}: MultiStepFormProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#0CF574]/5 to-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </h2>
              <h1 className="text-2xl font-bold text-gray-900">
                {steps[currentStep].title}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {steps[currentStep].description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#0CF574]">
                {Math.round(progress)}%
              </div>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0CF574] to-[#0CF574]/80 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      index < currentStep
                        ? 'bg-[#0CF574] text-white'
                        : index === currentStep
                        ? 'bg-[#0CF574] text-white ring-4 ring-[#0CF574]/30'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 mt-2 hidden md:block text-center max-w-[80px]">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex gap-3">
            {showSkip && onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Skip this step
              </button>
            )}

            <button
              type="button"
              onClick={onNext}
              disabled={isNextDisabled || isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-[#0CF574] text-white rounded-lg font-semibold hover:bg-[#0CF574]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Saving...
                </>
              ) : isLastStep ? (
                <>
                  <Check className="w-5 h-5" />
                  Submit
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Auto-save indicator */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0CF574]" />
            <span className="text-sm text-gray-600">Saving draft...</span>
          </div>
        )}
      </div>
    </div>
  );
}
