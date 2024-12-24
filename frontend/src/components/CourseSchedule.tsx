import React from 'react';
import { Calendar, Edit } from 'lucide-react';
import type { CoursePreference } from '../types';

type CourseScheduleProps = {
  preferences: CoursePreference[];
  onEdit: () => void;
};

export const CourseSchedule: React.FC<CourseScheduleProps> = ({ preferences, onEdit }) => {
  // This would be replaced with actual course recommendations based on preferences
  const generateRecommendations = (preferences: CoursePreference[]) => {
    return preferences.flatMap(pref => {
      const courses = [];
      for (let i = 0; i < pref.count; i++) {
        courses.push({
          code: `${pref.designation.slice(0, 3).toUpperCase()} ${101 + i}`,
          name: `Sample ${pref.designation} Course ${i + 1}`,
          credits: 3,
          designation: pref.designation,
        });
      }
      return courses;
    });
  };

  const recommendations = generateRecommendations(preferences);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Schedule</h1>
            <p className="text-gray-600">Based on your preferences</p>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Preferences
          </button>
        </div>

        <div className="space-y-6">
          {recommendations.map((course, index) => (
            <div
              key={index}
              className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
            >
              <Calendar className="w-5 h-5 text-blue-500 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{course.code}: {course.name}</h3>
                <p className="text-sm text-gray-500">
                  {course.credits} credits • {course.designation}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This schedule is a recommendation based on your preferences.</p>
          <p>Please consult with your academic advisor before finalizing your course selection.</p>
        </div>
      </div>
    </div>
  );
};