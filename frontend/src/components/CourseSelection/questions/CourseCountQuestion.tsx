import React from 'react';
import { BookOpen } from 'lucide-react';

type CourseCountQuestionProps = {
  selected: 3 | 4;
  onAnswer: (count: 3 | 4) => void;
};

export const CourseCountQuestion: React.FC<CourseCountQuestionProps> = ({ selected, onAnswer }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">How many courses would you like to take?</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select the number of courses you plan to take this quarter.
      </p>

      <div className="flex justify-center space-x-4">
        {[3, 4].map((count) => (
          <button
            key={count}
            onClick={() => onAnswer(count as 3 | 4)}
            className={`px-8 py-3 rounded-lg text-lg font-medium transition-colors
              ${selected === count
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {count} Courses
          </button>
        ))}
      </div>
    </div>
  );
};