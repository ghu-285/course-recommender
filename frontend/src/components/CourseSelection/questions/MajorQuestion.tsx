import React from 'react';
import { BookOpen } from 'lucide-react';
import { MultiSelect } from '../../common/MultiSelect';

const AVAILABLE_MAJORS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Biology',
  'Chemistry',
  'Economics',
  'Psychology',
  'English',
  'History',
];

type MajorQuestionProps = {
  selected: string[];
  onAnswer: (majors: string[]) => void;
};

export const MajorQuestion: React.FC<MajorQuestionProps> = ({ selected, onAnswer }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">What is your declared or intended major?</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select your major(s) from the list below. You can choose multiple if you're pursuing a double major.
      </p>

      <MultiSelect
        options={AVAILABLE_MAJORS}
        selected={selected}
        onChange={onAnswer}
        label="Select Majors"
      />
    </div>
  );
};