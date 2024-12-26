import { uploadTranscript } from './api/transcript';
import { mapTranscriptToUser } from './transcript/mapper';
import type { User } from '../types';

export async function parseTranscript(file: File): Promise<Partial<User>> {
  try {
    // Directly upload the PDF to the backend
    const data = await uploadTranscript(file);
    console.log('Response from backend:', data); // Debug log to inspect backend response

    // Map the backend response to a user object
    return mapTranscriptToUser(data);
  } catch (error) {
    console.error('Error parsing transcript:', error);
    throw new Error('Failed to connect to transcript parsing service. Please ensure the API server is running.');
  }
}
