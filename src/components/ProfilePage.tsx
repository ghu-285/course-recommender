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

  useEffect(() => {
    if (transcriptFile) {
      const url = URL.createObjectURL(transcriptFile);
      setTranscriptUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setTranscriptUrl(null);
  }, [transcriptFile]);

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
      onUpdate(parsedData, file);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">General Information</h2>
            <p className="text-gray-600">{user.name || 'N/A'}</p>
            <p className="text-gray-600">Start Quarter: {user.startQuarter || 'N/A'}</p>
            <p className="text-gray-600">Overall GPA: {user.gpa || 'N/A'}</p>
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
            <label
              htmlFor="upload-new-transcript"
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Transcript
            </label>
            <input
              id="upload-new-transcript"
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={handleFileChange}
            />
            {uploadStatus === 'processing' && (
              <p className="text-sm text-gray-500 mt-2">Processing...</p>
            )}
            {uploadStatus === 'error' && error && (
              <div className="mt-2 p-3 rounded bg-red-50 text-red-600 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Courses Taken</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.courses?.map((course, index) => (
            <div key={index} className="border p-3 rounded-lg shadow-sm">
              <h4 className="text-base font-medium text-gray-800">{course.code}</h4>
              <p className="text-base text-gray-600">{course.name}</p>
              <p className="text-sm text-gray-500">Grade: {course.grade}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
