import React, { useEffect, useState } from 'react';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import { parseTranscript } from '../services/transcriptParser';
import type { User } from '../types';

type ProfilePageProps = {
  user: User;
  transcriptFile: File | null;
  onUpdate: (updatedUser: Partial<User>, transcriptFile: File | null) => void;
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, transcriptFile, onUpdate }) => {
  const [transcriptUrl, setTranscriptUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Generate transcript URL for preview
  useEffect(() => {
    if (transcriptFile) {
      const url = URL.createObjectURL(transcriptFile);
      setTranscriptUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (user.transcript) {
      // If transcript exists in MongoDB, create a Blob URL
      const transcriptBlob = new Blob([user.transcript], { type: 'application/pdf' });
      const url = URL.createObjectURL(transcriptBlob);
      setTranscriptUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setTranscriptUrl(null);
  }, [transcriptFile, user.transcript]);

  // Save the updated user profile to MongoDB
  const saveUserToMongo = async (updatedUser: Partial<User>, file?: File) => {
    const formData = new FormData();
    formData.append('user', JSON.stringify(updatedUser));
    if (file) {
      formData.append('transcript', file);
    }

    try {
      const response = await fetch('http://localhost:8000/api/updateUser', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update user in the database.');
      }

      console.log('User updated successfully:', await response.json());
    } catch (err) {
      console.error('Error updating user in MongoDB:', err);
      setError('Failed to save updates to the database. Please try again later.');
    }
  };

  // Handle file upload and transcript parsing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file');
      return;
    }

    setError(null);
    setUploadStatus('processing');

    try {
      const parsedData = await parseTranscript(file);
      console.log('Parsed new transcript data:', parsedData);

      // Update frontend state
      onUpdate(parsedData, file);

      // Save updated profile to MongoDB, including the transcript file
      await saveUserToMongo({ ...user, ...parsedData }, file);

      setUploadStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process transcript');
      setUploadStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* General Info Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">General Info</h3>
            <p className="text-gray-600"><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-600"><strong>Start Quarter:</strong> {user.startQuarter || 'N/A'}</p>
            <p className="text-gray-600"><strong>GPA:</strong> {user.gpa || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Academic Programs</h3>
            <p className="text-gray-600"><strong>Majors:</strong> {user.majors.length > 0 ? user.majors.join(', ') : 'N/A'}</p>
            <p className="text-gray-600"><strong>Minors:</strong> {user.minors.length > 0 ? user.minors.join(', ') : 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Career Interests</h3>
            <p className="text-gray-600">{user.careerInterests.length > 0 ? user.careerInterests.join(', ') : 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">Transcript</h3>
            {transcriptUrl ? (
              <a
                href={transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <FileText className="inline-block mr-2 w-4 h-4" />
                View Current Transcript
              </a>
            ) : (
              <p className="text-gray-600">No transcript uploaded</p>
            )}
            <label htmlFor="upload-transcript" className="block mt-4 text-blue-600 cursor-pointer hover:underline">
              <Upload className="inline-block mr-2 w-4 h-4" />
              Upload New Transcript
              <input
                id="upload-transcript"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {uploadStatus === 'processing' && <p className="text-sm text-gray-500 mt-2">Processing...</p>}
            {uploadStatus === 'error' && error && (
              <div className="mt-2 text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.courses?.length > 0 ? (
            user.courses.map((course, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm">
                <p className="font-medium text-gray-900">{course.code}</p>
                <p className="text-gray-600">{course.name}</p>
                <p className="text-sm text-gray-500">Grade: {course.grade || 'N/A'}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No courses found</p>
          )}
        </div>
      </div>
    </div>
  );
};
