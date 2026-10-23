const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function investigateOffer({ offerText, url }) {
  let response;

  try {
    response = await fetch(`${apiBaseUrl}/api/investigate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerText, url }),
    });
  } catch {
    throw new Error('We could not reach ScamSieve. Check that the backend is running, then try again.');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('ScamSieve returned an unexpected response. Please try again.');
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || 'The investigation could not be completed. Please try again.');
  }

  return data;
}
