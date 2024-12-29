import React from 'react';
import { Briefcase } from 'lucide-react';
import { MultiSelect } from '../../common/MultiSelect';

const CAREER_INTERESTS = [
  'Agriculture and Food Systems',
  'Artificial Intelligence and Machine Learning',
  'Biotechnology and Pharmaceuticals',
  'Consulting and Strategy',
  'Creative Arts and Design',
  'Cybersecurity and Information Security',
  'Data Science and Analytics',
  'Education and Teaching',
  'Engineering (Mechanical, Civil, Electrical, Chemical)',
  'Environmental Policy and Energy Management',
  'Environmental Science and Sustainability',
  'Finance and Investment Banking',
  'Film, Media, and Journalism',
  'Healthcare and Medicine',
  'History, Culture, and Philosophy',
  'Law and Legal Studies',
  'Marketing, Branding, and Sales',
  'Operations and Supply Chain Management',
  'Performing Arts and Music',
  'Physics and Space Science',
  'Product Management',
  'Psychology and Mental Health',
  'Public Health and Health Policy',
  'Public Policy and Advocacy',
  'Sports Science and Kinesiology',
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