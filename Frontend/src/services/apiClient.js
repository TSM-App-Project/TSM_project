const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const buildUrl = (path) => `${API_BASE}${path}`;

const readErrorMessage = async (response) => {
  try {
    const text = await response.text();
    return text || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
};

const request = async (path, options = {}) => {
  const headers = options.headers || {};
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  const response = await fetch(buildUrl(path), config);
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  del: (path) => request(path, { method: "DELETE" }),
};
