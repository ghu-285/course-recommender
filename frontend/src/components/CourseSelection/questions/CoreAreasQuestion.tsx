import React from 'react';
import { Compass } from 'lucide-react';
import type { CoreArea } from '../../../types';

type CoreAreasQuestionProps = {
  selected: CoreArea[];
  onAnswer: (areas: CoreArea[]) => void;
};

export const CoreAreasQuestion: React.FC<CoreAreasQuestionProps> = ({ selected, onAnswer }) => {
  const coreAreas: CoreArea[] = [
    'Arts',
    'Biological Sciences',
    'Civilization Studies',
    'Humanities',
    'Language',
    'Mathematical Sciences',
    'Physical Sciences',
    'Social Sciences',
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Compass className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Which core areas interest you most?</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Select the core curriculum areas you're most interested in studying.
      </p>

      <select
        multiple
        value={selected}
        onChange={(e) => onAnswer(Array.from(e.target.selectedOptions, option => option.value) as CoreArea[])}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        size={6}
      >
        {coreAreas.map(area => (
          <option key={area} value={area}>{area}</option>
        ))}
      </select>
      
      <p className="mt-2 text-sm text-gray-500">
        These preferences will help us recommend appropriate core curriculum courses.
      </p>
    </div>
  );
};