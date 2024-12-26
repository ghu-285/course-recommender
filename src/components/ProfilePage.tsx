import React, { useEffect, useState } from 'react';
import { FileText, GraduationCap, BookOpen, Library } from 'lucide-react';
import type { User } from '../types';

type ProfilePageProps = {
  user: User;
  transcriptFile: File | null; // Include transcriptFile prop
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, transcriptFile }) => {
  const [transcriptUrl, setTranscriptUrl] = useState<string | null>(null);

  // Generate Object URL for the uploaded transcript
  useEffect(() => {
    if (transcriptFile) {
      const url = URL.createObjectURL(transcriptFile);
      setTranscriptUrl(url);

      // Cleanup URL when component unmounts or file changes
      return () => URL.revokeObjectURL(url);
    }
    setTranscriptUrl(null);
  }, [transcriptFile]);

  const calculateGPA = (courses: User['courses']) => {
    if (!courses || courses.length === 0) return 'N/A';
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalGradePoints = courses.reduce((sum, course) => {
      const gradePoints = gradeToPoints(course.grade);
      return sum + gradePoints * course.credits;
    }, 0);
    return (totalGradePoints / totalCredits).toFixed(2);
  };

  const gradeToPoints = (grade: string) => {
    const gradeScale: { [key: string]: number } = {
      A: 4.0,
      'A-': 3.7,
      B: 3.0,
      'B+': 3.3,
      'B-': 2.7,
      C: 2.0,
      'C+': 2.3,
      'C-': 1.7,
      D: 1.0,
      F: 0.0,
    };
    return gradeScale[grade] || 0.0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* General Info Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">General Information</h2>
            <p className="text-gray-600">{user.name || 'N/A'}</p>
            <p className="text-gray-600">Start Quarter: {user.startQuarter || 'N/A'}</p>
            <p className="text-gray-600">Overall GPA: {user.gpa || calculateGPA(user.courses)}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Academic Programs</h2>
            <p className="text-gray-600">Majors: {user.majors.length > 0 ? user.majors.join(', ') : 'N/A'}</p>
            <p className="text-gray-600">Minors: {user.minors.length > 0 ? user.minors.join(', ') : 'N/A'}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Career Interests</h2>
            <p className="text-gray-600">{user.careerInterests.length > 0 ? user.careerInterests.join(', ') : 'N/A'}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Documents</h2>
            {transcriptUrl ? (
              <a
                href={transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-500"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Current Transcript
              </a>
            ) : (
              <p className="text-gray-600">No transcript uploaded</p>
            )}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.courses?.map((course, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-800">{course.code}</h3>
              <p className="text-sm text-gray-600">{course.name}</p>
              <p className="text-sm text-gray-500">
                {course.credits} credits • Grade: {course.grade} • {course.designation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
