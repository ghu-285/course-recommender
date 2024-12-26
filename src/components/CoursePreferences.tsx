import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import type { CourseDesignation, CoreArea, CoursePreference } from '../types';

type CoursePreferencesProps = {
  totalCourses: number;
  majors: string[];
  minors: string[];
  onSubmit: (preferences: CoursePreference[]) => void;
};

export const CoursePreferences: React.FC<CoursePreferencesProps> = ({
  totalCourses,
  majors,
  minors,
  onSubmit,
}) => {
  const [preferences, setPreferences] = useState<CoursePreference[]>([]);
  const [showCoreAreas, setShowCoreAreas] = useState(false);

  const designations: CourseDesignation[] = [
    'Core Curriculum',
    ...(majors.length > 0 ? ['Major' as const] : []),
    ...(minors.length > 0 ? ['Minor' as const] : []),
  ];

  const coreAreas: CoreArea[] = [
    'Art',
    'Biology',
    'Humanities',
    'Social Science',
    'Civilization',
  ];

  useEffect(() => {
    setPreferences(
      designations.map(designation => ({
        designation,
        count: 0,
        ...(designation === 'Core Curriculum' ? { coreAreas: [] } : {}),
      }))
    );
  }, []);

  const handleCountChange = (designation: CourseDesignation, count: number) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.designation === designation ? { ...pref, count } : pref
      )
    );

    if (designation === 'Core Curriculum') {
      setShowCoreAreas(count > 0);
    }
  };

  const handleCoreAreaChange = (areas: CoreArea[]) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.designation === 'Core Curriculum' ? { ...pref, coreAreas: areas } : pref
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const totalSelected = preferences.reduce((sum, pref) => sum + pref.count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Preferences</h1>
          <p className="text-gray-600">
            Select how many courses you want to take in each area (Total: {totalSelected}/{totalCourses})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {designations.map(designation => (
            <div key={designation}>
              <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
                <BookOpen className="w-5 h-5 mr-2" />
                {designation}
              </label>
              <input
                type="number"
                min="0"
                max={totalCourses}
                value={preferences.find(p => p.designation === designation)?.count || 0}
                onChange={(e) => handleCountChange(designation, parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}

          {showCoreAreas && (
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Core Curriculum Areas
              </label>
              <select
                multiple
                value={preferences.find(p => p.designation === 'Core Curriculum')?.coreAreas || []}
                onChange={(e) => handleCoreAreaChange(Array.from(e.target.selectedOptions, option => option.value as CoreArea))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                size={5}
              >
                {coreAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={totalSelected !== totalCourses}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate Schedule
          </button>

          {totalSelected !== totalCourses && (
            <p className="text-red-500 text-sm text-center">
              Please select exactly {totalCourses} courses in total
            </p>
          )}
        </form>
      </div>
    </div>
  );
};