import React from 'react';
import { Check } from 'lucide-react';

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-blue-500 border-blue-500'
                      : isCurrent
                      ? 'bg-white border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-sm font-medium ${isCurrent ? 'text-blue-500' : 'text-gray-500'}`}>
                      {stepNumber}
                    </span>
                  )}
                </div>
                <span className={`mt-2 text-sm ${isCurrent ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
                  Step {stepNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};