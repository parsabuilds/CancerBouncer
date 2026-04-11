const API_BASE = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:3001/api';

export async function analyzeRisk(userData) {
  const response = await fetch(`${API_BASE}/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to analyze risk');
  }

  return response.json();
}
