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
            <p className="text-gray-600">Start Quarter: Fall 2023</p>
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

      {/* Course History Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Curriculum Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <GraduationCap className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Core Curriculum</h2>
          </div>
          <div className="space-y-4">
            {filterCoursesByDesignation('Core').map((course, index) => (
              <div key={index} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{course.code}</h3>
                    <p className="text-sm text-gray-600">{course.name}</p>
                    <p className="text-xs text-gray-500">{course.area}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {course.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Major Courses Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Major Courses</h2>
          </div>
          <div className="space-y-4">
            {filterCoursesByDesignation('Major').map((course, index) => (
              <div key={index} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{course.code}</h3>
                    <p className="text-sm text-gray-600">{course.name}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {course.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minor Courses Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Library className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Minor Courses</h2>
          </div>
          <div className="space-y-4">
            {filterCoursesByDesignation('Minor').map((course, index) => (
              <div key={index} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{course.code}</h3>
                    <p className="text-sm text-gray-600">{course.name}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {course.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};