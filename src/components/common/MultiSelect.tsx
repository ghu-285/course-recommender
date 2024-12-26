import React from 'react';
import { X } from 'lucide-react';

type MultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label: string;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  label,
}) => {
  const handleSelect = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (optionToRemove: string) => {
    onChange(selected.filter(option => option !== optionToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {/* Selected Options */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map(option => (
          <span
            key={option}
            className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {option}
            <button
              type="button"
              onClick={() => removeOption(option)}
              className="ml-1 inline-flex items-center p-0.5 hover:bg-blue-200 rounded-full"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Options Dropdown */}
      <select
        multiple
        value={selected}
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
          onChange(selectedOptions);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        size={5}
      >
        {options.map(option => (
          <option
            key={option}
            value={option}
            className={`p-2 ${selected.includes(option) ? 'bg-blue-50' : ''}`}
          >
            {option}
          </option>
        ))}
      </select>
      
      <p className="mt-1 text-sm text-gray-500">
        Hold Ctrl/Cmd to select multiple options
      </p>
    </div>
  );
};