import React from 'react';
import { BookOpen } from 'lucide-react';
import { MultiSelect } from '../../common/MultiSelect';

const AVAILABLE_MINORS = [
  'Business',
  'Data Science',
  'Creative Writing',
  'Philosophy',
  'Music',
  'Art History',
];

type MinorQuestionProps = {
  selected: string[];
  onAnswer: (minors: string[]) => void;
};

export const MinorQuestion: React.FC<MinorQuestionProps> = ({ selected, onAnswer }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Do you have any minors?</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select any minors you're pursuing. Leave empty if none.
      </p>

      <MultiSelect
        options={AVAILABLE_MINORS}
        selected={selected}
        onChange={onAnswer}
        label="Select Minors"
      />
    </div>
  );
};