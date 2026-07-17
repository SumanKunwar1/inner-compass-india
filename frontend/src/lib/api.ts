/**
 * Thin fetch wrapper for the BTMC backend API.
 * The admin JWT is kept in localStorage and attached to protected calls.
 */

export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "http://localhost:5000/api";

const TOKEN_KEY = "btmc:token";

const isBrowser = typeof window !== "undefined";

export function getToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  if (isBrowser) localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  if (isBrowser) localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Options = { auth?: boolean; body?: unknown };

async function request<T>(method: string, path: string, { auth, body }: Options = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  if (res.status === 401 && auth) {
    clearToken();
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>("GET", path, { auth }),
  post: <T>(path: string, body?: unknown, auth = false) => request<T>("POST", path, { body, auth }),
  put: <T>(path: string, body?: unknown, auth = true) => request<T>("PUT", path, { body, auth }),
  patch: <T>(path: string, body?: unknown, auth = true) => request<T>("PATCH", path, { body, auth }),
  delete: <T>(path: string, auth = true) => request<T>("DELETE", path, { auth }),
};
