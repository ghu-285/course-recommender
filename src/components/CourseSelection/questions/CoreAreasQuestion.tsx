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
  requiredCoreCount: number;
  onAnswer: (areas: CoreArea[]) => void;
};

export const CoreAreasQuestion: React.FC<CoreAreasQuestionProps> = ({
  selected,
  requiredCoreCount,
  onAnswer,
}) => {
  const handleSelectionChange = (areas: CoreArea[]) => {
    if (areas.length <= requiredCoreCount) {
      onAnswer(areas); // Update the parent state only when within the required limit
    }
  };

  const isValid = selected.length <= requiredCoreCount;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <Compass className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">
          Which core requirements do you need to fulfill? ({selected.length}/{requiredCoreCount})
        </h2>
      </div>

      <p className="text-gray-600 mb-6">
        Select up to {requiredCoreCount} core curriculum areas you’re interested in.
      </p>

      <MultiSelect
        options={CORE_AREAS}
        selected={selected}
        onChange={handleSelectionChange}
        label="Core Areas"
      />

      {!isValid && (
        <p className="mt-2 text-sm text-red-500">
          Please select no more than {requiredCoreCount} core areas.
        </p>
      )}

      <p className="mt-2 text-sm text-gray-500">
        These preferences will help us recommend appropriate core curriculum courses.
      </p>
    </div>
  );
};
