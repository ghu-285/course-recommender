import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';
import { QuestionFlow } from './components/CourseSelection/QuestionFlow';
import { CourseSchedule } from './components/CourseSchedule';
import { ProfilePage } from './components/ProfilePage';
import { Header } from './components/Header/Header';
import { LandingPage } from './components/LandingPage';
import type { User, CoursePreference } from './types';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [preferences, setPreferences] = useState<CoursePreference[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'schedule' | 'profile' | 'course-selection' | 'help'>('schedule');

  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);

  const handleAuth = (data: { 
    email: string; 
    password: string; 
    transcriptFile?: File;
    parsedData?: Partial<User>;
  }) => {
    console.log('Parsed data in handleAuth:', data.parsedData);

    setTranscriptFile(data.transcriptFile || null); // Store the transcript file

    setUser({ 
      email: data.email,
      name: data.parsedData?.name || 'Unknown',
      majors: data.parsedData?.majors || [],
      minors: data.parsedData?.minors || [],
      careerInterests: data.parsedData?.careerInterests || [],
      startQuarter: data.parsedData?.startQuarter || 'N/A', // Use startQuarter directly
      gpa: data.parsedData?.gpa ?? 3.75,
      courses: data.parsedData?.courses ?? [],
    });

    console.log('User after handleAuth:', {
      email: data.email,
      name: data.parsedData?.name || 'Unknown',
      startQuarter: data.parsedData?.startQuarter || 'N/A',
    });

    setCurrentPage('course-selection');
  };

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'home':
        setUser(null);
        setShowAuth(false);
        setCurrentPage('schedule');
        break;
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
    setTranscriptFile(null); // Clear the transcript file on sign-out
    setShowAuth(false);
    setCurrentPage('schedule');
  };

  const handleCourseSelectionComplete = (
    preferences: CoursePreference[], 
    answers: { majors: string[]; minors: string[]; careerInterests: string[] }
  ) => {
    console.log('Received preferences in parent:', preferences);
    console.log('Received answers in parent:', answers);

    const updatedUser = {
      ...user,
      majors: answers.majors.length > 0 ? answers.majors : user?.majors || [],
      minors: answers.minors.length > 0 ? answers.minors : user?.minors || [],
      careerInterests: answers.careerInterests.length > 0 ? answers.careerInterests : user?.careerInterests || [],
      startQuarter: user?.startQuarter || 'N/A', // Preserve startQuarter from parsed data
    };

    console.log('Updated user profile:', updatedUser);

    setUser(updatedUser);
    setPreferences(preferences);
    setCurrentPage('schedule');
  };

  if (!showAuth && !user) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (!user) {
    return <AuthForm onSubmit={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onNavigate={handleNavigate} onSignOut={handleSignOut} />
      
      <main className="pt-16">
        {currentPage === 'course-selection' && (
          <QuestionFlow onComplete={(preferences, answers) => handleCourseSelectionComplete(preferences, answers)} />
        )}
        
        {currentPage === 'schedule' && (
          <CourseSchedule
            preferences={preferences}
            onEdit={() => setCurrentPage('course-selection')}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage user={user} transcriptFile={transcriptFile} />
        )}
        
        {currentPage === 'help' && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Help Center</h2>
              <p className="text-gray-600">Need assistance? Contact us at qghu@uchicago.edu or winstongan@uchicago.edu</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
