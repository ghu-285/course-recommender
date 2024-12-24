import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { ProfileForm } from './components/ProfileForm';
import { CoursePreferences } from './components/CoursePreferences';
import { CourseSchedule } from './components/CourseSchedule';
import { ProfilePage } from './components/ProfilePage';
import { Header } from './components/Header/Header';
import type { User, CoursePreference } from './types';

function App() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [courseCount, setCourseCount] = useState<3 | 4>(4);
  const [preferences, setPreferences] = useState<CoursePreference[]>([]);
  const [currentPage, setCurrentPage] = useState<'schedule' | 'profile' | 'course-selection' | 'help'>('schedule');

  const handleAuth = (data: { email: string; password: string; transcript?: File }) => {
    setUser({ 
      email: data.email,
      majors: [],
      minors: [],
      careerInterests: [],
      transcript: data.transcript,
      startQuarter: 'Fall 2023', // This would come from transcript parsing
      gpa: 3.75, // This would come from transcript parsing
    });
    setStep(2);
  };

  const handleProfile = (data: { 
    majors: string[];
    minors: string[];
    careerInterests: string[];
  }) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    setStep(3);
  };

  const handleCourseCount = (count: 3 | 4) => {
    setCourseCount(count);
    setStep(4);
  };

  const handlePreferences = (prefs: CoursePreference[]) => {
    setPreferences(prefs);
    setStep(5);
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'profile':
        setCurrentPage('profile');
        break;
      case 'course selection':
        setCurrentPage('course-selection');
        setStep(4);
        break;
      case 'help':
        setCurrentPage('help');
        break;
      default:
        setCurrentPage('schedule');
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setStep(1);
    setCurrentPage('schedule');
  };

  if (!user) {
    return <AuthForm onSubmit={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onNavigate={handleNavigate} onSignOut={handleSignOut} />
      
      <main className="pt-16"> {/* Add padding to account for fixed header */}
        {step === 2 && <ProfileForm onSubmit={handleProfile} />}
        
        {step === 3 && (
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
              <h2 className="text-2xl font-bold mb-6">How many courses would you like to take?</h2>
              <div className="space-x-4">
                <button
                  onClick={() => handleCourseCount(3)}
                  className="px-8 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  3 Courses
                </button>
                <button
                  onClick={() => handleCourseCount(4)}
                  className="px-8 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  4 Courses
                </button>
              </div>
            </div>
          </div>
        )}
        
        {step === 4 && (
          <CoursePreferences
            totalCourses={courseCount}
            majors={user.majors}
            minors={user.minors}
            onSubmit={handlePreferences}
          />
        )}
        
        {step === 5 && currentPage === 'schedule' && (
          <CourseSchedule
            preferences={preferences}
            onEdit={() => setStep(4)}
          />
        )}

        {currentPage === 'profile' && <ProfilePage user={user} />}
        
        {currentPage === 'help' && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Help Center</h2>
              <p className="text-gray-600">Need assistance? Contact academic support at support@university.edu</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;