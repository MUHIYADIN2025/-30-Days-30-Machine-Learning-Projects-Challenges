const API_BASE_URL = 'http://localhost:8001'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export async function predictSpecies(payload) {
  return request('/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function checkHealth() {
  return request('/health', { method: 'GET' })
}
