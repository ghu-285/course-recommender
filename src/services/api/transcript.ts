import { API_CONFIG } from './config';
import type { TranscriptResponse } from './types';

export async function uploadTranscript(file: File): Promise<TranscriptResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.parseTranscript}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to parse transcript');
  }

  return response.json();
}