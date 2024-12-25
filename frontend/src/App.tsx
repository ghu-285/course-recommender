import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { ProfileForm } from './components/ProfileForm';
import { QuestionFlow } from './components/CourseSelection/QuestionFlow';
import { CourseSchedule } from './components/CourseSchedule';
import { ProfilePage } from './components/ProfilePage';
import { Header } from './components/Header/Header';
import type { User, CoursePreference } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<CoursePreference[]>([]);
  const [currentPage, setCurrentPage] = useState<'schedule' | 'profile' | 'course-selection' | 'help'>('schedule');

  const handleAuth = (data: { email: string; password: string; transcript?: File }) => {
    setUser({ 
      email: data.email,
      majors: [],
      minors: [],
      careerInterests: [],
      transcript: data.transcript,
      startQuarter: 'Fall 2023',
      gpa: 3.75,
    });
    setCurrentPage('course-selection');
  };

  const handlePreferences = (prefs: CoursePreference[]) => {
    setPreferences(prefs);
    setCurrentPage('schedule');
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'profile':
        setCurrentPage('profile');
        break;
      case 'course selection':
        setCurrentPage('course-selection');
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
    setPreferences([]);
    setCurrentPage('schedule');
  };

  if (!user) {
    return <AuthForm onSubmit={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onNavigate={handleNavigate} onSignOut={handleSignOut} />
      
      <main className="pt-16">
        {currentPage === 'course-selection' && (
          <QuestionFlow onComplete={handlePreferences} />
        )}
        
        {currentPage === 'schedule' && preferences.length > 0 && (
          <CourseSchedule
            preferences={preferences}
            onEdit={() => setCurrentPage('course-selection')}
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