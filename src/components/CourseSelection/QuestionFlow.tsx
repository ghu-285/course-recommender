import React, { useState } from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { MajorQuestion } from './questions/MajorQuestion';
import { MinorQuestion } from './questions/MinorQuestion';
import { CareerQuestion } from './questions/CareerQuestion';
import { CourseCountQuestion } from './questions/CourseCountQuestion';
import { CourseDistributionQuestion } from './questions/CourseDistributionQuestion';
import { CoreAreasQuestion } from './questions/CoreAreasQuestion';
import { TimePreferencesQuestion } from './questions/TimePreferencesQuestion';
import type { CoursePreference } from '../../types';

type QuestionFlowProps = {
  onComplete: (
    preferences: CoursePreference[],
    answers: {
      majors: string[];
      minors: string[];
      careerInterests: string[];
      timePreferences?: any;
    }
  ) => void;
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
    timePreferences: null,
  });

  const totalSteps = 7;

  const handleNext = () => {
    if (step === 5) {
      const coreRequirement = answers.courseDistribution.find(
        (pref) => pref.designation === 'Core Curriculum'
      );
      if (!coreRequirement || coreRequirement.count === 0) {
        setStep(7); // Skip CoreAreasQuestion if no core curriculum required
        return;
      }
    }

    if (step < totalSteps) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const handleComplete = () => {
    const updatedPreferences = answers.courseDistribution.map((pref) =>
      pref.designation === 'Core Curriculum'
        ? { ...pref, coreAreas: answers.coreAreas }
        : pref
    );

    const finalAnswers = {
      majors: answers.majors,
      minors: answers.minors,
      careerInterests: answers.careerInterests,
      timePreferences: answers.timePreferences,
    };

    console.log('Completed with preferences:', updatedPreferences);
    console.log('Final answers:', finalAnswers);

    onComplete(updatedPreferences, finalAnswers);
  };

  const updateAnswers = (field: keyof typeof answers, value: any) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const renderQuestion = () => {
    switch (step) {
      case 1:
        return (
          <MajorQuestion
            selected={answers.majors}
            onAnswer={(majors) => updateAnswers('majors', majors)}
          />
        );
      case 2:
        return (
          <MinorQuestion
            selected={answers.minors}
            onAnswer={(minors) => updateAnswers('minors', minors)}
          />
        );
      case 3:
        return (
          <CareerQuestion
            selected={answers.careerInterests}
            onAnswer={(careerInterests) => updateAnswers('careerInterests', careerInterests)}
          />
        );
      case 4:
        return (
          <CourseCountQuestion
            selected={answers.courseCount}
            onAnswer={(count) => updateAnswers('courseCount', count)}
          />
        );
      case 5:
        return (
          <CourseDistributionQuestion
            courseCount={answers.courseCount}
            majors={answers.majors}
            minors={answers.minors}
            onAnswer={(distribution) => updateAnswers('courseDistribution', distribution)}
          />
        );
      case 6:
        const requiredCoreCount = answers.courseDistribution.find(
          (pref) => pref.designation === 'Core Curriculum'
        )?.count || 0;

        return (
          <CoreAreasQuestion
            selected={answers.coreAreas}
            requiredCoreCount={requiredCoreCount}
            onAnswer={(areas) => updateAnswers('coreAreas', areas)}
          />
        );
      case 7:
        return (
          <TimePreferencesQuestion
            onAnswer={(timePrefs) => updateAnswers('timePreferences', timePrefs)}
          />
        );
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
                className="px-6 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
            )}
            {step < totalSteps && (
              <button
                onClick={handleNext}
                className="px-6 py-2 text-sm font-medium text-black bg-gray-100 rounded-lg hover:bg-gray-200 ml-auto"
              >
                Next
              </button>
            )}
            {step === totalSteps && (
              <button
                onClick={handleComplete}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
