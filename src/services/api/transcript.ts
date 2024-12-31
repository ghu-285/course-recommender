import { API_CONFIG } from './config';
import type { TranscriptResponse } from './types';

export async function uploadTranscript(file: File): Promise<TranscriptResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.parseTranscript}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: 'Unknown error occurred',
      }));
      throw new Error(error.detail || 'Failed to parse transcript');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading transcript:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while parsing the transcript'
    );
  }
}
