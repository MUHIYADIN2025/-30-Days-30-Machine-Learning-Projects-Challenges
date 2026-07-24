const API_BASE_URL = "http://localhost:8004";

export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  return response.json();
}

/**
 * @param {string} targetDate - ISO date string, e.g. "2026-08-15"
 * @returns {Promise<{target_date: string, predicted_temperature_f: number}>}
 */
export async function forecastTemperature(targetDate) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_date: targetDate }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Prediction failed (${response.status}): ${body}`);
  }

  return response.json();
}