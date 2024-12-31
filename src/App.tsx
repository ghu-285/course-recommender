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
  const [currentPage, setCurrentPage] = useState<'home' | 'schedule' | 'profile' | 'course-selection' | 'help'>('profile'); // Default to 'profile'

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
      startQuarter: data.parsedData?.startQuarter || 'N/A',
      gpa: data.parsedData?.gpa ?? 3.75,
      courses: data.parsedData?.courses ?? [],
    });
  
    console.log('User after handleAuth:', {
      email: data.email,
      name: data.parsedData?.name || 'Unknown',
      startQuarter: data.parsedData?.startQuarter || 'N/A',
    });
  
    setCurrentPage('profile'); // Redirect to the profile page after login
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
    setTranscriptFile(null);
    setShowAuth(false);
    setCurrentPage('schedule');
  };

  const handleCourseSelectionComplete = async (
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
      preferences, // Store preferences if needed
    };
  
    try {
      // Update user in MongoDB
      const response = await fetch('http://localhost:8000/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update user profile');
      }
  
      const data = await response.json();
      console.log('User profile updated:', data);
      alert('Profile updated successfully!');
  
      // Update local user state
      setUser(updatedUser);
      setPreferences(preferences);
      setCurrentPage('profile'); // Navigate to profile page
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('Failed to update profile. Please try again later.');
    }
  };

  const handleTranscriptUpdate = async (parsedData: Partial<User>, file: File | null) => {
    console.log('Updating profile with new transcript data:', parsedData);

    setUser((prevUser) => ({
      ...prevUser,
      ...parsedData,
    }));

    setTranscriptFile(file);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('profile'); // Redirect to the profile page on login success
  };

  if (!showAuth && !user) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (!user) {
    return <AuthForm onSubmit={handleAuth} onLoginSuccess={handleLoginSuccess} />;
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
          <ProfilePage
            user={user}
            transcriptFile={transcriptFile}
            onUpdate={handleTranscriptUpdate}
          />
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
