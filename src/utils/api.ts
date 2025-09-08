type ApiOptions = {
  method?: string;
  body?: any;
  headers?: Record<string,string>;
};

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function apiFetch(path: string, opts: ApiOptions = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}
