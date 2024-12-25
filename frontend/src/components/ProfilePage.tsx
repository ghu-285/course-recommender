import React from 'react';
import { FileText, GraduationCap, BookOpen, Library } from 'lucide-react';
import { User } from '../types';

type ProfilePageProps = {
  user: User;
};

type Course = {
  code: string;
  name: string;
  grade: string;
  credits: number;
  designation: 'Core' | 'Major' | 'Minor';
  area?: string;
};

// This would be replaced with actual parsed data from the transcript
const mockCourses: Course[] = [
  { code: 'CORE101', name: 'Introduction to Humanities', grade: 'A', credits: 3, designation: 'Core', area: 'Humanities' },
  { code: 'CS101', name: 'Computer Science I', grade: 'A-', credits: 3, designation: 'Major' },
  { code: 'MATH101', name: 'Calculus I', grade: 'B+', credits: 3, designation: 'Minor' },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const calculateGPA = (courses: Course[]) => {
    // Mock GPA calculation
    return '3.75';
  };

  const filterCoursesByDesignation = (designation: Course['designation']) => {
    return mockCourses.filter(course => course.designation === designation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* General Info Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">General Information</h2>
            <p className="text-gray-600">{user.name}</p>
            <p className="text-gray-600">Start Quarter: {user.startQuarter}</p>
            <p className="text-gray-600">Overall GPA: {calculateGPA(mockCourses)}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Academic Programs</h2>
            <div className="space-y-1">
              <p className="text-gray-600">Majors: {user.majors.join(', ')}</p>
              <p className="text-gray-600">Minors: {user.minors.join(', ')}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Career Interests</h2>
            <p className="text-gray-600">{user.careerInterests.join(', ')}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Documents</h2>
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Current Transcript
            </a>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* ... */}
    </div>
  );
};