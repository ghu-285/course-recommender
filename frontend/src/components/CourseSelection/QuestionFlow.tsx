import React, { useState } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { MajorQuestion } from './questions/MajorQuestion';
import { MinorQuestion } from './questions/MinorQuestion';
import { CareerQuestion } from './questions/CareerQuestion';
import { CourseCountQuestion } from './questions/CourseCountQuestion';
import { CourseDistributionQuestion } from './questions/CourseDistributionQuestion';
import { CoreAreasQuestion } from './questions/CoreAreasQuestion';
import type { User, CoursePreference } from '../../types';

type QuestionFlowProps = {
  onComplete: (preferences: CoursePreference[]) => void;
};

export const QuestionFlow: React.FC<QuestionFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    majors: [] as string[],
    minors: [] as string[],
    careerInterests: [] as string[],
    courseCount: 4 as 3 | 4,
    courseDistribution: [] as CoursePreference[],
    coreAreas: [] as string[],
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateAnswers = (field: keyof typeof answers, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    handleNext();
  };

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return <MajorQuestion 
          selected={answers.majors} 
          onAnswer={(majors) => updateAnswers('majors', majors)} 
        />;
      case 2:
        return <MinorQuestion 
          selected={answers.minors} 
          onAnswer={(minors) => updateAnswers('minors', minors)} 
        />;
      case 3:
        return <CareerQuestion 
          selected={answers.careerInterests} 
          onAnswer={(careers) => updateAnswers('careerInterests', careers)} 
        />;
      case 4:
        return <CourseCountQuestion 
          selected={answers.courseCount} 
          onAnswer={(count) => updateAnswers('courseCount', count)} 
        />;
      case 5:
        return <CourseDistributionQuestion 
          courseCount={answers.courseCount}
          majors={answers.majors}
          minors={answers.minors}
          onAnswer={(distribution) => updateAnswers('courseDistribution', distribution)} 
        />;
      case 6:
        return <CoreAreasQuestion 
          selected={answers.coreAreas}
          onAnswer={(areas) => {
            const finalPreferences = answers.courseDistribution.map(pref => 
              pref.designation === 'Core Curriculum' 
                ? { ...pref, coreAreas: areas }
                : pref
            );
            onComplete(finalPreferences);
          }} 
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />
        
        <div className="max-w-2xl mx-auto">
          {renderQuestion()}
          
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};