// Thin fetch wrapper around the Letter Village API.
// Reads the base URL from REACT_APP_API_URL, attaches the JWT when present,
// and unwraps the { data, message, status } / { error, message, status } envelope.

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const TOKEN_KEY = "lv_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(payload.message || res.statusText);
    err.status = res.status;
    err.name = payload.error || "RequestError";
    throw err;
  }

  return payload.data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) =>
    request(path, { ...opts, method: "PATCH", body }),
  del: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

export default api;
