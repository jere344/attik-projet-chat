// Shared API utility for authenticated requests

export function createApiClient(token) {
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return {
    get: async (url) => {
      const response = await fetch(url, { headers: authHeaders });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      return response.json();
    },

    post: async (url, data) => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      return response.json();
    },

    delete: async (url) => {
      const response = await fetch(url, { method: 'DELETE', headers: authHeaders });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      return response.json();
    },
  };
}
