const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function uploadTranscript(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/parse-transcript`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to parse transcript');
  }

  return response.json();
}