import React from 'react';
import { BookOpen } from 'lucide-react';
import { MultiSelect } from '../../common/MultiSelect';

const AVAILABLE_MAJORS = [
  'Anthropology',
  'Art History',
  'Astronomy and Astrophysics',
  'Biological Chemistry',
  'Biological Sciences',
  'Chemistry',
  'Cinema and Media Studies',
  'Classical Studies',
  'Cognitive Science',
  'Comparative Human Development',
  'Comparative Literature',
  'Computational and Applied Mathematics',
  'Computer Science',
  'Creative Writing',
  'Data Science',
  'East Asian Languages and Civilizations',
  'Economics',
  'English Language and Literature',
  'Environment, Geography, and Urbanization',
  'Environmental Science',
  'Fundamentals: Issues and Texts',
  'Gender and Sexuality Studies',
  'Geographic Information Science',
  'Geophysical Sciences',
  'Germanic Studies',
  'Global Studies',
  'History',
  'History, Philosophy, and Social Studies of Science and Medicine',
  'Human Rights',
  'Inquiry and Research in the Humanities',
  'Jewish Studies',
  'Latin American and Caribbean Studies',
  'Law, Letters, and Society',
  'Linguistics',
  'Mathematics',
  'Media Arts and Design',
  'Medieval Studies',
  'Middle Eastern Studies',
  'Molecular Engineering',
  'Music',
  'Neuroscience',
  'Philosophy',
  'Physics',
  'Political Science',
  'Psychology',
  'Public Policy Studies',
  'Race, Diaspora, and Indigeneity',
  'Religious Studies',
  'Romance Languages and Literatures',
  'Russian and East European Studies',
  'Sociology',
  'South Asian Languages and Civilizations',
  'Statistics',
  'Theater and Performance Studies',
  'Visual Arts'
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
        Select your major(s) from the list below. You can choose more than one if you're pursuing multiple majors.
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