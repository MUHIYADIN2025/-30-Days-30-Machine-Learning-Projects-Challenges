const API_BASE = 'http://localhost:8000';

export async function fetchHealth() {
  const response = await fetch(`${API_BASE}/health`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchPrediction(medInc) {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ med_inc: medInc })
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = payload?.detail || `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return payload;
}
