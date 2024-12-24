import React, { useState, useEffect } from 'react';
import { BarChart } from 'lucide-react';
import type { CoursePreference, CourseDesignation } from '../../../types';

type CourseDistributionQuestionProps = {
  courseCount: number;
  majors: string[];
  minors: string[];
  onAnswer: (distribution: CoursePreference[]) => void;
};

export const CourseDistributionQuestion: React.FC<CourseDistributionQuestionProps> = ({
  courseCount,
  majors,
  minors,
  onAnswer,
}) => {
  const [distribution, setDistribution] = useState<CoursePreference[]>([]);

  const designations: CourseDesignation[] = [
    'Core Curriculum',
    ...(majors.length > 0 ? ['Major' as const] : []),
    ...(minors.length > 0 ? ['Minor' as const] : []),
  ];

  useEffect(() => {
    setDistribution(
      designations.map(designation => ({
        designation,
        count: 0,
      }))
    );
  }, []);

  const handleCountChange = (designation: CourseDesignation, count: number) => {
    const newDistribution = distribution.map(item =>
      item.designation === designation ? { ...item, count } : item
    );
    setDistribution(newDistribution);
    
    const total = newDistribution.reduce((sum, item) => sum + item.count, 0);
    if (total === courseCount) {
      onAnswer(newDistribution);
    }
  };

  const totalSelected = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <BarChart className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">How would you like to distribute your courses?</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Specify how many courses you want to take in each area (Total: {totalSelected}/{courseCount})
      </p>

      <div className="space-y-4">
        {designations.map(designation => (
          <div key={designation} className="flex items-center justify-between">
            <label className="text-gray-700">{designation}</label>
            <input
              type="number"
              min="0"
              max={courseCount}
              value={distribution.find(item => item.designation === designation)?.count || 0}
              onChange={(e) => handleCountChange(designation, parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      {totalSelected !== courseCount && (
        <p className="mt-4 text-red-500 text-sm">
          Please allocate exactly {courseCount} courses across the available areas.
        </p>
      )}
    </div>
  );
};