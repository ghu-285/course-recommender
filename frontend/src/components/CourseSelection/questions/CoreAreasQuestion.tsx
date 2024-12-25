import React from 'react';
import { Compass } from 'lucide-react';
import { MultiSelect } from '../../common/MultiSelect';
import type { CoreArea } from '../../../types';

const CORE_AREAS = [
  'Arts',
  'Biological Sciences',
  'Civilization Studies',
  'Humanities',
  'Language',
  'Mathematical Sciences',
  'Physical Sciences',
  'Social Sciences',
] as const;

type CoreAreasQuestionProps = {
  selected: CoreArea[];
  onAnswer: (areas: CoreArea[]) => void;
};

export const CoreAreasQuestion: React.FC<CoreAreasQuestionProps> = ({ selected, onAnswer }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Compass className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Which core areas interest you most?</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select the core curriculum areas you're most interested in studying.
      </p>

      <MultiSelect
        options={CORE_AREAS}
        selected={selected}
        onChange={onAnswer as (selected: string[]) => void}
        label="Select Core Areas"
      />
      
      <p className="mt-2 text-sm text-gray-500">
        These preferences will help us recommend appropriate core curriculum courses.
      </p>
    </div>
  );
};