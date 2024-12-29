import React from 'react';
import { BookOpen } from 'lucide-react';
import { MultiSelect } from '../../common/MultiSelect';

const AVAILABLE_MINORS = [
  'Architectural Studies',
  'Art History',
  'Astronomy and Astrophysics',
  'Biological Sciences',
  'Chemistry',
  'Cinema and Media Studies',
  'Classical Studies',
  'Cognitive Science',
  'Computational Neuroscience',
  'Computational Social Science',
  'Computer Science',
  'Creative Writing',
  'Data Science',
  'Democracy Studies',
  'Digital Studies of Language, Culture, and History',
  'East Asian Languages and Civilizations',
  'Education and Society',
  'English Language and Literature',
  'Environment, Geography, and Urbanization',
  'Gender and Sexuality Studies',
  'Germanic Studies',
  'Health and Society',
  'History',
  'History, Philosophy, and Social Studies of Science and Medicine',
  'Human Rights',
  'Inequality, Social Problems and Change',
  'Jewish Studies',
  'Latin American and Caribbean Studies',
  'Linguistics',
  'Mathematics',
  'Media Arts and Design',
  'Medieval Studies',
  'Middle Eastern Studies',
  'Molecular Engineering',
  'Music',
  'Neuroscience',
  'Norwegian Studies',
  'Philosophy',
  'Physics',
  'Quantitative Social Analysis',
  'Race, Diaspora, and Indigeneity',
  'Religious Studies',
  'Renaissance Studies',
  'Romance Languages and Literatures',
  'Russian and East European Studies',
  'Science Communication/Public Discourse',
  'South Asian Languages and Civilizations',
  'Statistics',
  'Theater and Performance Studies',
  'Visual Arts',
  'Yiddish'
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