import React from 'react';
import { Briefcase } from 'lucide-react';
import { MultiSelect } from '../../common/MultiSelect';

const CAREER_INTERESTS = [
  'Software Development',
  'Data Science',
  'Research',
  'Consulting',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
];

type CareerQuestionProps = {
  selected: string[];
  onAnswer: (careers: string[]) => void;
};

export const CareerQuestion: React.FC<CareerQuestionProps> = ({ selected, onAnswer }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Briefcase className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">What career paths interest you?</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select the career paths you're interested in pursuing.
      </p>

      <MultiSelect
        options={CAREER_INTERESTS}
        selected={selected}
        onChange={onAnswer}
        label="Select Career Interests"
      />
    </div>
  );
};