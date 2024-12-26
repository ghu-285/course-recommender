import React, { useState } from 'react';
import { BookOpen, Briefcase } from 'lucide-react';

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

const AVAILABLE_MINORS = [
  'Business',
  'Data Science',
  'Creative Writing',
  'Philosophy',
  'Music',
  'Art History',
];

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

type ProfileFormProps = {
  onSubmit: (data: {
    majors: string[];
    minors: string[];
    careerInterests: string[];
  }) => void;
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const [majors, setMajors] = useState<string[]>([]);
  const [minors, setMinors] = useState<string[]>([]);
  const [careerInterests, setCareerInterests] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ majors, minors, careerInterests });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Profile</h1>
          <p className="text-gray-600">Tell us about your academic interests</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
              <BookOpen className="w-5 h-5 mr-2" />
              Declared/Intended Majors
            </label>
            <select
              multiple
              value={majors}
              onChange={(e) => setMajors(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={4}
            >
              {AVAILABLE_MAJORS.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <div>
            <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
              <BookOpen className="w-5 h-5 mr-2" />
              Minors
            </label>
            <select
              multiple
              value={minors}
              onChange={(e) => setMinors(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={4}
            >
              {AVAILABLE_MINORS.map(minor => (
                <option key={minor} value={minor}>{minor}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center text-lg font-medium text-gray-700 mb-2">
              <Briefcase className="w-5 h-5 mr-2" />
              Career Interests
            </label>
            <select
              multiple
              value={careerInterests}
              onChange={(e) => setCareerInterests(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size={4}
            >
              {CAREER_INTERESTS.map(career => (
                <option key={career} value={career}>{career}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};